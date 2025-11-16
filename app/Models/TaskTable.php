<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskTable extends Model
{
    protected $guarded = [];
    protected $fillable = [
        'judul',
        'deskripsi',
        'deadline',
        'list_id',  // Sesuaikan dengan nama kolom di database
        'sudah_selesai',
        'user_id'
    ];
    protected $casts = [
        'sudah_selesai' => 'boolean',
        'deadline' => 'date',
    ];

    public function List(): BelongsTo{
        return $this->belongsTo(ListTable::class, 'list_id','id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
