<?php

namespace Database\Seeders;

use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        try {
            if (DB::table('users')->count() == 0) {
                DB::table('users')->insert([
                    [
                        'id' => 1,
                        'id_role' => 1,
                        'name' => 'guru',
                        'email' => 'admin@gmail.com',
                        'password' => Hash::make('password123'),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                    [
                        'id' => 2,
                        'id_role' => 2,
                        'name' => 'user',
                        'email' => 'siswa@gmail.com',
                        'password' => Hash::make('1234567890'),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                ]);

                $this->command->info('UserSeeder: Data inserted successfully.');
            } else {
                $this->command->warn('UserSeeder: Table already contains data, skipping insert.');
            }
        } catch (Exception $e) {
            $this->command->error('UserSeeder: Failed to insert data. Error: ' . $e->getMessage());
        }
    }

}
