<?php


// database/migrations/xxxx_xx_xx_create_tasks_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTasksTable extends Migration
{
   public function up()
{
    Schema::create('tasks', function (Blueprint $table) {
        $table->id();
        $table->string('title');          // ✅ This must exist
        $table->text('description');      // ✅ This must exist
        $table->string('color')->default('#28a745');
        $table->timestamp('start_time')->nullable();
        $table->timestamp('end_time')->nullable();
        $table->integer('elapsed_time')->default(0);
        $table->string('status')->default('Pending');
        $table->timestamps();
    });
}


    public function down()
    {
        Schema::dropIfExists('tasks');
    }
}
