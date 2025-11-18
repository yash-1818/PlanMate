import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, } from '@/components/ui/card';
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, List, Calendar, Search, ChevronLeft, ChevronRight, CheckCircle, Ghost, Trash } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Task {
    id: number,
    judul: string,
    deskripsi: string,
    sudah_selesai: boolean,
    deadline: string | null,
    list_id: number,
    list: {
        id: number;
        judul: string;
    }
}

interface List {
    id: number,
    judul: string
}

interface Props {
    tasks: {
        data: Task[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    lists: List[];
    filters: {
        search: string;
        filter: string;
    };
    flash?: {
        success?: string;
        error?: string;
    }
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tugas',
        href: '/tasks'
    }
]

export default function TasksIndex({ tasks, lists, filters, flash }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [completionFilter, setCompletionFilter] = useState<'all' | 'completed' | 'pending'>(filters.filter as 'all' | 'completed' | 'pending');
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

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const { data, setData, post, put, processing, reset, delete: destroy } = useForm({
        'judul': '',
        'deskripsi': '',
        'deadline': '',
        'list_id': '',
        'sudah_selesai': false as boolean,
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingTask) {
            put(`/tasks/${editingTask.id}`, {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    setEditingTask(null);
                },
            });
        } else {
            post('/tasks', {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    }

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setData({
            judul: task.judul,
            deskripsi: task.deskripsi,
            deadline: task.deadline || '',
            list_id: task.list_id.toString(),
            sudah_selesai: task.sudah_selesai,
        });
        setIsOpen(true);
    }

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get('/tasks', {
            search: searchTerm,
            filter: completionFilter,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    const handleFilterChange = (value: 'all' | 'completed' | 'pending') => {
        setCompletionFilter(value);
        router.get('/tasks', {
            search: searchTerm,
            filter: value,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        router.get('/tasks', {
            page,
            search: searchTerm,
            filter: completionFilter,
        }, {
            preserveState: true,
            preserveScroll: true,
        })
    }

    const handleDelete = (taskId: number) => {
        destroy(`/tasks/${taskId}`);
        setDeleteId(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Tugas' />
            <div className='flex h-full flex-1 flex-col gap-6 rounded-xl p-6 bg-gradient-to-br from-background to-muted/20'>
                {showToast && (
                    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
                        } text-white animate-in fade-in slide-in-from-top-5`}>
                        {toastType === 'success' ? (
                            <CheckCircle2 className='h-5 w-5' />
                        ) : (
                            <XCircle className='h-5 w-5' />
                        )}
                        <span>
                            {toastMessage}
                        </span>
                    </div>
                )}

                <div className='flex flex-col gap-2'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-3xl font-bold tracking-tight'>Tugas</h1>
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button className='bg-primary hover:bg-primary/90 text-white shadow-lg'>
                                    <Plus className='h-4 w-4 mr-2' />
                                    Tambah Tugas
                                </Button>
                            </DialogTrigger>

                            <DialogContent className='sm:max-w-[425px]'>
                                <DialogHeader>
                                    <DialogTitle className='text-xl'>
                                        {editingTask ? 'Edit Tugas' : 'Tambah Tugas Baru'}
                                    </DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className='space-y-4'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='judul'>Judul</Label>
                                        <Input id='judul' value={data.judul}
                                            onChange={(e) => setData('judul', e.target.value)}
                                            required
                                            className='focus:ring-2 focus:ring-primary'
                                        />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor="deskripsi">Deskripsi</Label>
                                        <Textarea id='deskripsi' value={data.deskripsi}
                                            onChange={(e) => setData('deskripsi', e.target.value)}
                                            className='focus:ring-2 focus:ring-primary'
                                        />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='list_id'>List</Label>
                                        <Select value={data.list_id}
                                            onValueChange={(value) => setData('list_id', value)}>
                                            <SelectTrigger className='focus:ring-2 focus:ring-primary'>
                                                <SelectValue placeholder='Pilih List' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {lists.map((list) => (
                                                    <SelectItem key={list.id} value={list.id.toString()}>
                                                        {list.judul}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className='space-y-2'>
                                        <Label htmlFor='deadline'>Deadline</Label>
                                        <Input id='deadline' type='date'
                                            value={data.deadline}
                                            onChange={(e) => setData('deadline', e.target.value)}
                                            className='focus:ring-2 focus:ring-primary'
                                        />
                                    </div>

                                    <div className='flex items-center space-x-2'>
                                        <Input type="checkbox"
                                            id='sudah_selesai'
                                            checked={data.sudah_selesai}
                                            onChange={(e) => setData('sudah_selesai', e.target.checked)}
                                            className='h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-primary' />
                                        <Label htmlFor='sudah_selesai'>Selesai</Label>
                                    </div>

                                    <Button type='submit' disabled={processing}
                                        className='w-full bg-primary hover:bg-primary/90 text-white shadow-lg'>
                                        {editingTask ? 'Update' : 'Create'}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <p className='text-muted-foreground'>Kelola semua aktivitasmu dengan lebih mudah dan terstruktur</p>
                </div>

                <div className='flex gap-4'>
                    <form onSubmit={handleSearch} className='relative flex-1'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                        <Input placeholder='Cari Tugas...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='pl-10' />
                    </form>

                    <Select value={completionFilter}
                        onValueChange={handleFilterChange}>
                        <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='all'>Semua Tugas</SelectItem>
                            <SelectItem value='completed'>Selesai</SelectItem>
                            <SelectItem value='pending'>Pending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className='rounded-md border'>
                    <div className='relative w-full overflow-auto'>
                        <table className='w-full caption-bottom text-sm'>
                            <thead className='[&_tr]:border-b'>
                                <tr className='border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted'>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Judul</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Deskripsi</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>List</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Deadline</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Status</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Aksi</th>
                                </tr>
                            </thead>
                            <tbody className='[&_tr:last-child]:border-0'>
                                {tasks.data.map((task) => (
                                    <tr key={task.id} className='border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted'>
                                        <td className='p-4 align-middle font-medium'>{task.judul}</td>
                                        <td className='p-4 align-middle max-w-[200px] truncate'>
                                            {task.deskripsi || 'Tidak ada deskripsi'}
                                        </td>
                                        <td className='p-4 align-middle'>
                                            <div className='flex items-center gap-2'>
                                                <List className='h-4 w-4 text-muted-foreground' />
                                                {task.list.judul}
                                            </div>
                                        </td>
                                        <td className='p-4 align-middle'>
                                            {task.deadline ? (
                                                <div className='flex items-center gap-2'>
                                                    <Calendar className='h-4 w-4 text-muted-foreground' />
                                                    {new Date(task.deadline).toLocaleDateString()}
                                                </div>
                                            ) : (
                                                <span className='text-muted-foreground'>Tidak ada deadline</span>
                                            )}
                                        </td>
                                        <td className='p-4 align-middle'>
                                            {task.sudah_selesai ? (
                                                <div className='flex items-center gap-2 text-green-500'>
                                                    <CheckCircle className='h-4 w-4' />
                                                    <span>Selesai</span>
                                                </div>
                                            ) : (
                                                <div className='flex items-center gap-2 text-yellow-500'>
                                                    <span>Pending</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className='p-4 align-middle'>
                                            <div className='flex justify-center gap-2'>
                                                <Button size='icon'
                                                    variant='ghost'
                                                    onClick={() => handleEdit(task)}
                                                    className='hover:bg-primary/10 hover:text-primary'
                                                >
                                                    <Pencil className='h-4 w-4' />
                                                </Button>
                                                <Button variant='ghost'
                                                    size="icon"
                                                    onClick={() => setDeleteId(task.id)}
                                                    className='hover:bg-destructive/10 hover:text-destructive'>
                                                    <Trash className='h-4 w-4' />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {tasks.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className='p-8 text-center text-muted-foreground'>
                                            Tidak Ada Tugas
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
                        Menampilkan {tasks.from} data {tasks.to} dari {tasks.total} Hasil
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Button variant='outline'
                            size='icon'
                            onClick={() => handlePageChange(tasks.current_page - 1 )}
                            disabled={tasks.current_page === 1}>
                                <ChevronLeft className='h-4 w-4'/>
                        </Button>
                        <div className='flex items-center space-x-1'>
                            {Array.from({ length: tasks.last_page }, (_, i) => i + 1).map((page) => (
                               <Button key={page}
                                    variant={page === tasks.current_page ? 'default' : 'outline'}
                                    size='icon'
                                    onClick={() => handlePageChange(page)}
                                >
                                        {page}
                               </Button>
                            ))}
                        </div>
                        <Button variant='outline'
                            size='icon'
                            onClick={() => handlePageChange(tasks.current_page + 1)}
                            disabled={tasks.current_page === tasks.last_page}
                        >
                            <ChevronRight className='w-4 h-4'/>
                        </Button>
                    </div>
                </div>

                {/* Alert Dialog untuk Delete */}
                <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Tugas?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus tugas ini? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => deleteId && handleDelete(deleteId)}
                                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                            >
                                Hapus
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    )
}
