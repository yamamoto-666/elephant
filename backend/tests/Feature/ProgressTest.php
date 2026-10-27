<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Models\User;
use Tests\TestCase;

class ProgressTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     */
    public function test_guest_cannot_access_progress(): void
    {
        $response = $this->getJson('/api/progress');

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_get_progress(): void
    {
        $user = User::factory()->create([
            'xp' => 20,
            'level' => 1,
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/progress');

        $response->assertOk();

        $response->assertJsonPath('total_xp', 20);
        $response->assertJsonPath('level', 1);
        $response->assertJsonPath('completed_lessons', 0);
        $response->assertJsonPath('average_score', 0);
    }
}
