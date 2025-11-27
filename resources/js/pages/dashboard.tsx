import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { List, CheckCircle, Clock, AlertCircle, Plus, Users } from 'lucide-react';
import { Card, CardContent, CardTitle, CardHeader, CardDescription, CardFooter } from '@/components/ui/card';
import { Button  } from '@/components/ui/button';
import { Link  } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface ChartDataPoint {
    month: string;
    tasks: number;
}

interface Props {
    stats?: {
        totalList: number;
        totalTask: number;
        tugasSelesai: number;
        tugasPending: number;
        totalUser: number;
        totalRole: number;
    };
    chartData?: ChartDataPoint[];
}

const chartConfig = {
  desktop: {
    label: "Tasks",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

// Helper function untuk hitung trend
const calculateTrend = (data: ChartDataPoint[]) => {
    if (data.length < 2) return { trend: 0 };

    const lastMonth = data[data.length - 1].tasks;
    const previousMonth = data[data.length - 2].tasks;

    if (previousMonth === 0) return { trend: lastMonth > 0 ? 100 : 0 };

    const trend = ((lastMonth - previousMonth) / previousMonth * 100).toFixed(1);
    return { trend: parseFloat(trend as string) };
};

export default function Dashboard({
    stats = {
        totalList: 0,
        totalTask: 0,
        tugasSelesai: 0,
        tugasPending: 0,
        totalUser: 0,
        totalRole: 0,
    },
    chartData = []
}: Props) {
    console.log(stats)
    console.log(chartData)

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
                        <Link href='/lists'>
                            <Button className='bg-primary hover:bg-primary/90  shadow-lg'>
                                <List className='h-4 w-4 mr-2'/>
                                Lihat List
                            </Button>
                        </Link>
                        <Link href='/tasks'>
                            <Button className='bg-primary hover:bg-primary/90  shadow-lg'>
                                <CheckCircle className='h-4 w-4 mr-2'/>
                                Lihat Tugas
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    <Card className='bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-600/20'>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium text-blue-500'>
                                Total List
                            </CardTitle>
                            <List className='h-4 w-4 text-blue-500'/>
                        </CardHeader>
                        <CardContent>
                            <div className='text-3xl  font-bold text-blue-500'>{stats.totalList}</div>
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
                            <div className='text-3xl  font-bold text-green-500'>{stats.totalTask}</div>
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
                            <div className='text-3xl  font-bold text-yellow-500 '>
                                {stats.tugasPending}
                            </div>
                            <p className='text-sm text-muted-foreground'>
                                Tugas yang belum terselesaikan.
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
                            <div className='text-3xl  font-bold text-purple-500'>{stats.tugasSelesai}</div>
                            <p className='text-sm text-muted-foreground'>
                                Tugas terselesaikan
                            </p>
                        </CardContent>
                    </Card>

                    <Card className='bg-gradient-to-br from-orange-500/10 to-red-600/10 border-orange-500/20'>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium text-orange-500'>
                                Total User
                            </CardTitle>
                            <Users className='h-4 w-4 text-orange-500'/>
                        </CardHeader>
                        <CardContent>
                            <div className='text-3xl  font-bold text-orange-500'>{stats.totalUser}</div>
                            <p className='text-sm text-muted-foreground'>
                                Pengguna terdaftar
                            </p>
                        </CardContent>
                    </Card>
                    <Card className='bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border-cyan-500/20'>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium text-cyan-500'>
                                Total Role
                            </CardTitle>
                            <Users className='h-4 w-4 text-cyan-500'/>
                        </CardHeader>
                        <CardContent>
                            <div className='text-3xl  font-bold text-cyan-500'>{stats.totalRole}</div>
                            <p className='text-sm text-muted-foreground'>
                                Jumlah Role
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className='grid gap-4 md:grid-cols-2'>
                    <Card className='border-primary/20'>
                        <CardHeader>
                            <CardTitle>Area Chart</CardTitle>
                            <CardDescription>
                            Menampilkan total Task yang dibuat tiap bulan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig}>
                                <AreaChart
                                    accessibilityLayer
                                    data={chartData}
                                    margin={{
                                        left: 12,
                                        right: 12,
                                    }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent indicator="line" />}
                                    />
                                    <Area
                                        dataKey="tasks"
                                        type="natural"
                                        fill="var(--color-desktop)"
                                        fillOpacity={0.4}
                                        stroke="var(--color-desktop)"
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter>
                            <div className="flex w-full items-start gap-2 text-sm">
                                <div className="grid gap-2">
                                    <div className="flex items-center gap-2 leading-none font-medium">
                                        Trending {calculateTrend(chartData).trend > 0 ? 'naik' : calculateTrend(chartData).trend < 0 ? 'turun' : 'tetap'} by {Math.abs(calculateTrend(chartData).trend)}% <TrendingUp className="h-4 w-4" />
                                    </div>
                                    <div className="text-muted-foreground flex items-center gap-2 leading-none">
                                        {chartData.length > 0 && `${chartData[0]?.month} - ${chartData[chartData.length - 1]?.month}`}
                                    </div>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>

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

                </div>
            </div>
        </AppLayout>
    )
}
