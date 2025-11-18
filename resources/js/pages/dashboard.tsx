import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { List, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import { Button  } from '@/components/ui/button';
import { Link  } from '@inertiajs/react';
import { Breadcrumb } from '@/components/ui/breadcrumb';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props {
    stats?: {
        totalList: number;
        totalTask: number;
        tugasSelesai: number;
        tugasPending: number;
    };
}

export default function Dashboard({ stats = {
    totalList: 0,
    totalTask:0,
    tugasSelesai:0,
    tugasPending:0
} } : Props) {
    console.log(stats)
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Dashboard' />
            <div className='flex h-full flex-1 flex-col gap-6 rounded-xl p-6 bg-gradient-to-br from-background to-muted'>
                <div className='flex justify-between items-center'>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
                        <p className='text-muted-foreground mt-1'>Selamat datang kembali, berikut tinjauan Anda</p>
                    </div>

                    <div className='flex gap-2'>
                        <Link href='/list'>
                            <Button className='bg-primary hover:bg-primary/90 text-white shadow-lg'>
                                <List className='h-4 w-4 mr-2'/>
                                Lihat List
                            </Button>
                        </Link>
                        <Link href='/tasks'>
                            <Button className='bg-primary hover:bg-primary/90 text-white shadow-lg'>
                                <CheckCircle className='h-4 w-4 mr-2'/>
                                Lihat Tugas
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                    <Card className='bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-600/20'>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium text-blue-500'>
                                Total List
                            </CardTitle>
                            <List className='h-4 w-4 text-blue-500'/>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold text-blue-500'>{stats.totalList}</div>
                            <p className='text-sm text-muted-foreground'>
                                Seluruh data List
                            </p>
                        </CardContent>
                    </Card>

                    <Card className='bg-gradient-to-br from-green-500/10 to-green-600/10 border-gray-500/20'>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium text-green-500'>
                                Total Tugas
                            </CardTitle>
                            <CheckCircle className='h-4 w-4 text-green-500'/>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold text-green-500'>{stats.totalTask}</div>
                            <p className='text-sm text-muted-foreground'>
                                Seluruh data Tugas
                            </p>
                        </CardContent>
                    </Card>

                    <Card className='bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/20'>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className=' text-sm font-medium text-yellow-500'>
                                Total tugas Pending
                            </CardTitle>
                            <Clock className=' h-4 w-4 text-yellow-500'/>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold text-yellow-500 '>
                                {stats.tugasPending}
                            </div>
                            <p className='text-sm text-muted-foreground'>
                                Tugas yang belum kamu selesaikan.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className='bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20'>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium text-purple-500'>
                                Total tugas Selesai
                            </CardTitle>
                            <CheckCircle className='h-4 w-4 text-purple-500'/>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold text-purple-500'>{stats.tugasSelesai}</div>
                            <p className='text-sm text-muted-foreground'>
                                Tugas terselesaikan
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className='grid gap-4 md:grid-cols-2'>
                    <Card className='border-primary/20'>
                        <CardHeader>
                            <CardContent>
                                <CardTitle className=' text-lg mb-3'>Aksi Cepat</CardTitle>
                                <div className='grid gap-4'>
                                    <Link href="/lists">
                                        <Button variant="outline" className='w-full justify-start'>
                                            <List className='mr-2 h-4 w-4'/>
                                            Lihat semua
                                        </Button>
                                    </Link>
                                    <Link href='/tasks'>
                                        <Button className='w-full justify-start'
                                            variant="outline">
                                                <CheckCircle className='mr-2 h-4 w-4 '/>
                                                Lihat semua
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </CardHeader>
                    </Card>

                    <Card className='border-primary/20'>
                        <CardHeader>
                            <CardTitle className='text-lg'>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <div className='space-y-4 '>
                            <div className='flex items-center gap-4'>
                                <div className='rounded-full bg-primary/10 p-2'>
                                    <Plus className='h-4 w-4 text-primary'/>
                                </div>
                            <div>
                                <p className='text-sm font-medium'>Selamat datang di PlaneMate</p>
                                <p className='text-xs text-muted-foreground'>
                                    Mulai dengan membuat Tugas atau List
                                </p>
                            </div>
                            </div>
                        </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
