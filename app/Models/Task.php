<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Task extends Model
{
    protected $fillable = [
        'title',
        'description',
        'color',
        'start_time',
        'end_time',
        'elapsed_time',
        'status',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'elapsed_time' => 'integer',
    ];
}
