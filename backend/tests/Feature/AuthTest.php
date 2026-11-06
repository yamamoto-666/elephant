<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     */
    public function test_user_can_register(): void
    {
        //ユーザー登録APIにリクエストを送信
        $response = $this->postJson('/register', [
            'name' => 'Test User',
            'email' => 'registration@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);


        //HTTPステータスが２０１か確認
        $response->assertStatus(201);

        //レスポンスのメールアドレスを確認
        $response->assertJsonPath(
            'user.email',
            'registration@example.com'
        );

        //DBにユーザーが保存されているか確認
        $this->assertDatabaseHas('users', [
            'email' => 'registration@example.com',
        ]);
    }

    public function test_user_can_login(): void
    {
        // テスト用ユーザーを作成
        $user = User::factory()->create([
            'email' => 'login@example.com',
            'password' => Hash::make('password123'),
        ]);

        // ログインリクエストを送信
        $response = $this->post('/login', [
            'email' => 'login@example.com',
            'password' => 'password123',
        ]);

        // デバッグ用：レスポンスを表示
        $response->dump();

        // ログイン後のリダイレクトを確認


        // 作成したユーザーとして認証されていることを確認
        $this->assertAuthenticatedAs($user);

        // HTTP 200が返されたことを確認
        $response->assertOk();

        // 作成したユーザーとしてログインできているか確認
        $this->assertAuthenticatedAs($user);
    }

    public function test_user_cannot_login_with_wrong_password(): void
    {
        // ① 正しいパスワードを持つユーザーを作成
        User::factory()->create([
            'email' => 'login@example.com',
            'password' => Hash::make('password123'),
        ]);

        // ② 間違ったパスワードでログイン
        $response = $this->postJson('/login', [
            'email' => 'login@example.com',
            'password' => 'wrongpassword',
        ]);

        // ③ 認証失敗時のHTTPステータスを確認
        $response->assertStatus(422);

        // ④ emailフィールドにエラーが返ることを確認
        $response->assertJsonValidationErrors('email');

        // ⑤ ログイン状態になっていないことを確認
        $this->assertGuest('web');
    }

    public function test_user_can_logout(): void
    {
        // ① テスト用ユーザーを作成
        $user = User::factory()->create();

        // ② ログイン済み状態でログアウトAPIを実行
        $response = $this->actingAs($user, 'web')
            ->postJson('/logout');

        // ③ HTTP 200を確認
        $response->assertOk();

        // ④ レスポンスのメッセージを確認
        $response->assertJsonPath(
            'message',
            'Logout successful'
        );

        // ⑤ ログアウトできたか確認
        $this->assertGuest('web');
    }
}
