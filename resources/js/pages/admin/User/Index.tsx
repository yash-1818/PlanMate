import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, User, Mail, Shield, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface User {
    id: number;
    name: string;
    email: string;
    // role can be a string (legacy) or an object relation from the backend
    role: string | { nama_role: string } | null;
    created_at: string;
}

interface Props {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search: string;
        role: string;
    };
    roles: { id: number; nama_role: string }[];
    errors?: Record<string, string>;
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User',
        href: '/users'
    }
];

export default function UsersIndex({ users, filters, flash, roles, errors }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [roleFilter, setRoleFilter] = useState<'all' | string>(filters.role as 'all' | string);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setToastType('success');
            setShowToast(true);
        } else if (flash?.error) {
            setToastMessage(flash.error);
            setToastType('error');
            setShowToast(true);
        }
    }, [flash]);

    // Show validation errors (from Inertia) as toast + keep inline errors
    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            const firstMessage = Object.values(errors)[0] as string;
            setToastMessage(firstMessage);
            setToastType('error');
            setShowToast(true);
        }
    }, [errors]);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const { data, setData, post, put, processing, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'siswa' as string,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingUser) {
            put(`/users/${editingUser.id}`, {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    setEditingUser(null);
                },
            });
        } else {
            post('/users', {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        const roleName = typeof user.role === 'string' ? user.role : user.role?.nama_role ?? 'siswa';
        const formRole = roleName === 'admin' ? 'admin' : 'siswa';
        setData('name', user.name);
        setData('email', user.email);
        setData('password', '');
        setData('password_confirmation', '');
        setData('role', formRole);
        setIsOpen(true);
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get('/users', {
            search: searchTerm,
            role: roleFilter,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleFilterChange = (value: string) => {
        setRoleFilter(value);
        router.get('/users', {
            search: searchTerm,
            role: value,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        router.get('/users', {
            page,
            search: searchTerm,
            role: roleFilter,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (userId: number) => {
        // close dialog immediately
        setDeleteId(null);

        router.delete(`/users/${userId}`, {
            onSuccess: () => {
                setToastMessage('User berhasil dihapus!');
                setToastType('success');
                setShowToast(true);
            },
            onError: (err: any) => {
                const msg = err?.message || 'Gagal menghapus user';
                setToastMessage(msg);
                setToastType('error');
                setShowToast(true);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='User' />
            <div className='flex h-full flex-1 flex-col gap-6 rounded-xl p-6 bg-gradient-to-br from-background to-muted/20'>
                {showToast && (
                    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg ${
                        toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
                    } text-white animate-in fade-in slide-in-from-top-5`}>
                        {toastType === 'success' ? (
                            <CheckCircle2 className='h-5 w-5' />
                        ) : (
                            <XCircle className='h-5 w-5' />
                        )}
                        <span>{toastMessage}</span>
                    </div>
                )}

                <div className='flex flex-col gap-2'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-3xl font-bold tracking-tight'>User Management</h1>
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button className='bg-primary hover:bg-primary/90 text-white shadow-lg'>
                                    <Plus className='h-4 w-4 mr-2' />
                                    Tambah User
                                </Button>
                            </DialogTrigger>

                            <DialogContent className='sm:max-w-[425px]'>
                                <DialogHeader>
                                    <DialogTitle className='text-xl'>
                                        {editingUser ? 'Edit User' : 'Tambah User Baru'}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Isi form berikut untuk {editingUser ? 'mengubah' : 'menambahkan'} user.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className='space-y-4'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='name'>Nama</Label>
                                        <Input
                                            id='name'
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            className='focus:ring-2 focus:ring-primary'
                                        />
                                        {errors?.name && (
                                            <p className='text-destructive text-sm mt-1'>{errors.name}</p>
                                        )}
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='email'>Email</Label>
                                        <Input
                                            id='email'
                                            type='email'
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                            className='focus:ring-2 focus:ring-primary'
                                        />
                                        {errors?.email && (
                                            <p className='text-destructive text-sm mt-1'>{errors.email}</p>
                                        )}
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='password'>Password {editingUser && '(Kosongkan jika tidak ingin mengubah)'}</Label>
                                        <Input
                                            id='password'
                                            type='password'
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            required={!editingUser}
                                            className='focus:ring-2 focus:ring-primary'
                                        />
                                        {errors?.password && (
                                            <p className='text-destructive text-sm mt-1'>{errors.password}</p>
                                        )}
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='password_confirmation'>Konfirmasi Password</Label>
                                        <Input
                                            id='password_confirmation'
                                            type='password'
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            required={!editingUser}
                                            className='focus:ring-2 focus:ring-primary'
                                        />
                                        {errors?.password_confirmation && (
                                            <p className='text-destructive text-sm mt-1'>{errors.password_confirmation}</p>
                                        )}
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='role'>Role</Label>
                                        <Select
                                            value={data.role}
                                            onValueChange={(value) => setData('role', value as string)}
                                        >
                                            <SelectTrigger className='focus:ring-2 focus:ring-primary'>
                                                <SelectValue placeholder='Pilih Role' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles.map((r) => (
                                                    <SelectItem key={r.id} value={r.nama_role}>
                                                        {r.nama_role.charAt(0).toUpperCase() + r.nama_role.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors?.role && (
                                            <p className='text-destructive text-sm mt-1'>{errors.role}</p>
                                        )}
                                    </div>

                                    <Button
                                        type='submit'
                                        disabled={processing}
                                        className='w-full bg-primary hover:bg-primary/90 text-white shadow-lg'
                                    >
                                        {editingUser ? 'Update' : 'Create'}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <p className='text-muted-foreground'>Kelola user dan hak akses aplikasi</p>
                </div>

                <div className='flex gap-4'>
                    <form onSubmit={handleSearch} className='relative flex-1'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                        <Input
                            placeholder='Cari User...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='pl-10'
                        />
                    </form>

                    <Select value={roleFilter} onValueChange={handleFilterChange}>
                        <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='all'>Semua Role</SelectItem>
                            {roles.map((r) => (
                                <SelectItem key={r.id} value={r.nama_role}>
                                    {r.nama_role.charAt(0).toUpperCase() + r.nama_role.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className='rounded-md border'>
                    <div className='relative w-full overflow-auto'>
                        <table className='w-full caption-bottom text-sm'>
                            <thead className='[&_tr]:border-b'>
                                <tr className='border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted'>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Nama</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Email</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Role</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Tanggal Pendaftaran</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Aksi</th>
                                </tr>
                            </thead>
                            <tbody className='[&_tr:last-child]:border-0'>
                                {users.data.map((user) => {
                                    const roleName = typeof user.role === 'string' ? user.role : user.role?.nama_role ?? null;
                                    return (
                                    <tr key={user.id} className='border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted'>

                                        <td className='p-4 align-middle font-medium'>
                                            <div className='flex items-center gap-2'>
                                                <User className='h-4 w-4 text-muted-foreground' />
                                                {user.name}
                                            </div>
                                        </td>

                                        <td className='p-4 align-middle'>
                                            <div className='flex items-center gap-2'>
                                                <Mail className='h-4 w-4 text-muted-foreground' />
                                                {user.email}
                                            </div>
                                        </td>

                                        <td className='p-4 align-middle'>
                                            <div className='flex items-center gap-2'>
                                                <Shield className='h-4 w-4 text-muted-foreground' />
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    roleName === 'admin' ? 'bg-purple-100 text-purple-800' : roleName === 'siswa' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {roleName ? (roleName.charAt(0).toUpperCase() + roleName.slice(1)) : '—'}
                                                </span>
                                            </div>
                                        </td>

                                        <td className='p-4 align-middle'>
                                            {new Date(user.created_at).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </td>

                                        <td className='p-4 align-middle'>
                                            <div className='flex justify-center gap-2'>
                                                <Button
                                                    size='icon'
                                                    variant='ghost'
                                                    onClick={() => handleEdit(user)}
                                                    className='hover:bg-primary/10 hover:text-primary'
                                                >
                                                    <Pencil className='h-4 w-4' />
                                                </Button>
                                                <Button
                                                    variant='ghost'
                                                    size="icon"
                                                    onClick={() => setDeleteId(user.id)}
                                                    className='hover:bg-destructive/10 hover:text-destructive'
                                                >
                                                    <Trash2 className='h-4 w-4' />
                                                </Button>
                                            </div>
                                        </td>

                                    </tr>
                                    )
                                })}
                                {users.data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className='p-8 text-center text-muted-foreground'>
                                            Tidak Ada User
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className='flex items-center justify-between px-2'>
                    <div className='text-sm text-muted-foreground'>
                        Menampilkan {users.from} sampai {users.to} dari {users.total} hasil
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Button
                            variant='outline'
                            size='icon'
                            onClick={() => handlePageChange(users.current_page - 1)}
                            disabled={users.current_page === 1}
                        >
                            <ChevronLeft className='h-4 w-4' />
                        </Button>
                        <div className='flex items-center space-x-1'>
                            {Array.from({ length: users.last_page }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={page === users.current_page ? 'default' : 'outline'}
                                    size='icon'
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant='outline'
                            size='icon'
                            onClick={() => handlePageChange(users.current_page + 1)}
                            disabled={users.current_page === users.last_page}
                        >
                            <ChevronRight className='w-4 h-4' />
                        </Button>
                    </div>
                </div>

                {/* Alert Dialog untuk Delete */}
                <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus User?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => deleteId && handleDelete(deleteId)}
                                className='bg-destructive text-white hover:bg-destructive/90'
                            >
                                Hapus
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
