<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LearningContentSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $course = Course::firstOrCreate(
                ['title' => 'Daily English'],
                [
                    'description' => 'Learn everyday English.',
                    'difficulty' => 'beginner',
                ],
            );

            $unit = $course
                ->units()
                ->firstOrCreate(
                    ['order_number' => 1],
                    ['title' => 'Greetings'],
                );

            $lesson = $unit->lessons()->firstOrCreate(
                ['order_number' => 1],
                [
                    'title' => 'Basic Greetings',
                    'content' => 'Learn how to greet people in English.',
                ],
            );

            $questions = [
                [
                    'order_number' => 1,
                    'question_text' => 'What does "Hello" mean in Japanese?',
                    'explanation' => 'Helloは「こんにちは」という意味です。',
                    'correct_answer' => 'こんにちは',
                    'answers' => [
                        'こんにちは',
                        'さようなら',
                        'ありがとう',
                        'おやすみなさい',
                    ],
                ],
                [
                    'order_number' => 2,
                    'question_text' => 'What does "Goodbye" mean in Japanese?',
                    'explanation' => 'Goodbyeは「さようなら」という意味です。',
                    'correct_answer' => 'さようなら',
                    'answers' => [
                        'さようなら',
                        'おはようございます',
                        'ありがとう',
                        'こんにちは',
                    ],
                ],
                [
                    'order_number' => 3,
                    'question_text' => 'What does "Good morning" mean in Japanese?',
                    'explanation' => 'Good morningは朝のあいさつです。',
                    'correct_answer' => 'おはようございます',
                    'answers' => [
                        'こんばんは',
                        'おはようございます',
                        'おやすみなさい',
                        'さようなら',
                    ],
                ],
                [
                    'order_number' => 4,
                    'question_text' => 'What does "Good evening" mean in Japanese?',
                    'explanation' => 'Good eveningは夕方や夜に会ったときのあいさつです。',
                    'correct_answer' => 'こんばんは',
                    'answers' => [
                        'ありがとう',
                        'おやすみなさい',
                        'こんばんは',
                        'おはようございます',
                    ],
                ],
                [
                    'order_number' => 5,
                    'question_text' => 'What does "Good night" mean in Japanese?',
                    'explanation' => 'Good nightは寝る前などに使う「おやすみなさい」です。',
                    'correct_answer' => 'おやすみなさい',
                    'answers' => [
                        'こんにちは',
                        'おはようございます',
                        'ありがとう',
                        'おやすみなさい',
                    ],
                ],
            ];

            $this->seedQuestions($lesson, $questions);

            $introductionLesson = $unit->lessons()->firstOrCreate(
                ['order_number' => 2],
                [
                    'title' => 'Introducing Yourself',
                    'content' => 'Learn how to introduce yourself in English.',
                ],
            );

            $introductionQuestions = [
                [
                    'order_number' => 1,
                    'question_text' => '「私の名前はユキです」を英語で言うと？',
                    'explanation' => 'My name is ...で自分の名前を伝えます。',
                    'correct_answer' => 'My name is Yuki.',
                    'answers' => [
                        'Your name is Yuki.',
                        'My name is Yuki.',
                        'Her name is Yuki.',
                        'His name is Yuki.',
                    ],
                ],
                [
                    'order_number' => 2,
                    'question_text' => '「私は日本出身です」を英語で言うと？',
                    'explanation' => 'I am from ...で出身地を伝えます。',
                    'correct_answer' => 'I am from Japan.',
                    'answers' => [
                        'I am from Canada.',
                        'I am from Australia.',
                        'I am from Japan.',
                        'I am from France.',
                    ],
                ],
                [
                    'order_number' => 3,
                    'question_text' => '「私は学生です」を英語で言うと？',
                    'explanation' => '学生はstudentです。I am a student.と表現します。',
                    'correct_answer' => 'I am a student.',
                    'answers' => [
                        'I am a teacher.',
                        'I am a doctor.',
                        'I am a driver.',
                        'I am a student.',
                    ],
                ],
                [
                    'order_number' => 4,
                    'question_text' => '「私は音楽が好きです」を英語で言うと？',
                    'explanation' => 'I like ...で好きなものを伝えます。',
                    'correct_answer' => 'I like music.',
                    'answers' => [
                        'I like music.',
                        'I like sports.',
                        'I like cooking.',
                        'I like reading.',
                    ],
                ],
                [
                    'order_number' => 5,
                    'question_text' => '初対面の相手に「はじめまして」と言うときの表現は？',
                    'explanation' => 'Nice to meet you.は初対面のあいさつです。',
                    'correct_answer' => 'Nice to meet you.',
                    'answers' => [
                        'See you tomorrow.',
                        'Nice to meet you.',
                        'Good night.',
                        'Welcome back.',
                    ],
                ],
            ];

            $this->seedQuestions($introductionLesson, $introductionQuestions);

            $hobbiesLesson = $unit->lessons()->firstOrCreate(
                ['order_number' => 3],
                [
                    'title' => 'Hobbies and Interests',
                    'content' => 'Learn how to talk about your hobbies.',
                ],
            );

            $hobbiesQuestions = [
                [
                    'order_number' => 1,
                    'question_text' => '「私の趣味は読書です」を英語で言うと？',
                    'explanation' => 'My hobby is ...で趣味を伝えます。読書はreadingです。',
                    'correct_answer' => 'My hobby is reading.',
                    'answers' => [
                        'My hobby is cooking.',
                        'My hobby is swimming.',
                        'My hobby is reading.',
                        'My hobby is dancing.',
                    ],
                ],
                [
                    'order_number' => 2,
                    'question_text' => '「私は週末にサッカーをします」を英語で言うと？',
                    'explanation' => 'play soccerは「サッカーをする」、on weekendsは「週末に」です。',
                    'correct_answer' => 'I play soccer on weekends.',
                    'answers' => [
                        'I play soccer on weekends.',
                        'I watch soccer on weekends.',
                        'I play tennis on weekends.',
                        'I play soccer every morning.',
                    ],
                ],
                [
                    'order_number' => 3,
                    'question_text' => '「自由な時間には何をしますか？」を英語で言うと？',
                    'explanation' => 'in your free timeは「自由な時間に」という意味です。',
                    'correct_answer' => 'What do you do in your free time?',
                    'answers' => [
                        'Where do you live?',
                        'What time do you go to work?',
                        'What is your name?',
                        'What do you do in your free time?',
                    ],
                ],
                [
                    'order_number' => 4,
                    'question_text' => '「私は音楽を聴くのが好きです」を英語で言うと？',
                    'explanation' => 'enjoyの後ろで動作を表すときは、listeningのような-ing形を使います。',
                    'correct_answer' => 'I enjoy listening to music.',
                    'answers' => [
                        'I enjoy playing the piano.',
                        'I enjoy listening to music.',
                        'I enjoy watching movies.',
                        'I enjoy reading books.',
                    ],
                ],
                [
                    'order_number' => 5,
                    'question_text' => '「あなたは料理が好きですか？」を英語で言うと？',
                    'explanation' => 'Do you like ...?で、相手が好きかどうかを尋ねます。',
                    'correct_answer' => 'Do you like cooking?',
                    'answers' => [
                        'Do you like swimming?',
                        'Do you like shopping?',
                        'Do you like cooking?',
                        'Do you like singing?',
                    ],
                ],
            ];

            $this->seedQuestions($hobbiesLesson, $hobbiesQuestions);

            $shoppingUnit = $course
                ->units()
                ->firstOrCreate(
                    ['order_number' => 2],
                    ['title' => 'Shopping and Dining'],
                );

            $foodLesson = $shoppingUnit->lessons()->firstOrCreate(
                ['order_number' => 1],
                [
                    'title' => 'Ordering Food',
                    'content' => 'Learn how to order food at a restaurant.',
                ],
            );

            $foodQuestions = [
                [
                    'order_number' => 1,
                    'question_text' => '「メニューをいただけますか？」を英語で言うと？',
                    'explanation' => 'Can I have ...?は、何かをもらいたいときに使える表現です。',
                    'correct_answer' => 'Can I have a menu, please?',
                    'answers' => [
                        'Can I have a menu, please?',
                        'Can I have the bill, please?',
                        'Can I have some water, please?',
                        'Can I have a spoon, please?',
                    ],
                ],
                [
                    'order_number' => 2,
                    'question_text' => '「チキンをお願いします」と注文するときの表現は？',
                    'explanation' => 'I would like ...は、希望を丁寧に伝える表現です。',
                    'correct_answer' => 'I would like the chicken, please.',
                    'answers' => [
                        'I would like the fish, please.',
                        'I would like the soup, please.',
                        'I would like the chicken, please.',
                        'I would like the salad, please.',
                    ],
                ],
                [
                    'order_number' => 3,
                    'question_text' => '「これは辛いですか？」を英語で言うと？',
                    'explanation' => 'spicyは、香辛料による「辛い」を表します。',
                    'correct_answer' => 'Is this spicy?',
                    'answers' => [
                        'Is this sweet?',
                        'Is this spicy?',
                        'Is this cold?',
                        'Is this salty?',
                    ],
                ],
                [
                    'order_number' => 4,
                    'question_text' => '「水をいただけますか？」を英語で言うと？',
                    'explanation' => 'some waterで、量を細かく指定せずに水を頼めます。',
                    'correct_answer' => 'Can I have some water, please?',
                    'answers' => [
                        'Can I have some rice, please?',
                        'Can I have some bread, please?',
                        'Can I have some soup, please?',
                        'Can I have some water, please?',
                    ],
                ],
                [
                    'order_number' => 5,
                    'question_text' => '食後に「お会計をお願いします」と言うときの表現は？',
                    'explanation' => 'the billは、レストランなどでの勘定書を指します。',
                    'correct_answer' => 'Can I have the bill, please?',
                    'answers' => [
                        'Can I have the bill, please?',
                        'Can I have a menu, please?',
                        'Can I have a fork, please?',
                        'Can I have another plate, please?',
                    ],
                ],
            ];

            $this->seedQuestions($foodLesson, $foodQuestions);

            $shoppingLesson = $shoppingUnit->lessons()->firstOrCreate(
                ['order_number' => 2],
                [
                    'title' => 'Shopping',
                    'content' => 'Learn useful expressions for shopping.',
                ],
            );

            $shoppingQuestions = [
                [
                    'order_number' => 1,
                    'question_text' => '「これはいくらですか？」を英語で言うと？',
                    'explanation' => 'How much is this?で商品の値段を尋ねます。',
                    'correct_answer' => 'How much is this?',
                    'answers' => [
                        'How much is this?',
                        'Where is this?',
                        'What time is it?',
                        'How old are you?',
                    ],
                ],
                [
                    'order_number' => 2,
                    'question_text' => '「これを試着してもいいですか？」を英語で言うと？',
                    'explanation' => 'try ... onは「〜を試着する」という意味です。',
                    'correct_answer' => 'Can I try this on?',
                    'answers' => [
                        'Can I take a photo?',
                        'Can I try this on?',
                        'Can I have some water?',
                        'Can I open the window?',
                    ],
                ],
                [
                    'order_number' => 3,
                    'question_text' => '「もっと大きいサイズはありますか？」を英語で言うと？',
                    'explanation' => 'a larger sizeで「もっと大きいサイズ」を表します。',
                    'correct_answer' => 'Do you have a larger size?',
                    'answers' => [
                        'Do you have a smaller size?',
                        'Do you have another color?',
                        'Do you have a larger size?',
                        'Do you have a shopping bag?',
                    ],
                ],
                [
                    'order_number' => 4,
                    'question_text' => '「カードで支払えますか？」を英語で言うと？',
                    'explanation' => 'pay by cardは「カードで支払う」という意味です。',
                    'correct_answer' => 'Can I pay by card?',
                    'answers' => [
                        'Can I pay tomorrow?',
                        'Can I pay in cash?',
                        'Can I return this?',
                        'Can I pay by card?',
                    ],
                ],
                [
                    'order_number' => 5,
                    'question_text' => '商品を買うと決めて「これにします」と言うときの表現は？',
                    'explanation' => 'I will take it.は商品を購入すると決めたときの表現です。',
                    'correct_answer' => 'I will take it.',
                    'answers' => [
                        'I will take it.',
                        'I am just looking.',
                        'It is too expensive.',
                        'I do not need it.',
                    ],
                ],
            ];

            $this->seedQuestions($shoppingLesson, $shoppingQuestions);

            $cafeLesson = $shoppingUnit->lessons()->firstOrCreate(
                ['order_number' => 3],
                [
                    'title' => 'At a Café',
                    'content' => 'Learn how to order drinks at a café.',
                ],
            );

            $cafeQuestions = [
                [
                    'order_number' => 1,
                    'question_text' => '「アイスコーヒーを1杯お願いします」を英語で言うと？',
                    'explanation' => 'I would like ...で丁寧に注文できます。iced coffeeはアイスコーヒーです。',
                    'correct_answer' => 'I would like an iced coffee, please.',
                    'answers' => [
                        'I would like a hot tea, please.',
                        'I would like an iced coffee, please.',
                        'I would like an orange juice, please.',
                        'I would like a hot chocolate, please.',
                    ],
                ],
                [
                    'order_number' => 2,
                    'question_text' => '「小さいサイズでお願いします」を英語で言うと？',
                    'explanation' => 'サイズを尋ねられたときは、Small, please.と答えられます。',
                    'correct_answer' => 'Small, please.',
                    'answers' => [
                        'Large, please.',
                        'Medium, please.',
                        'Small, please.',
                        'Hot, please.',
                    ],
                ],
                [
                    'order_number' => 3,
                    'question_text' => '「持ち帰りでお願いします」を英語で言うと？',
                    'explanation' => 'To go, please.は持ち帰りを希望するときの表現です。',
                    'correct_answer' => 'To go, please.',
                    'answers' => [
                        'For here, please.',
                        'Without sugar, please.',
                        'With milk, please.',
                        'To go, please.',
                    ],
                ],
                [
                    'order_number' => 4,
                    'question_text' => '「砂糖なしでお願いします」を英語で言うと？',
                    'explanation' => 'withoutは「〜なしで」という意味です。',
                    'correct_answer' => 'Without sugar, please.',
                    'answers' => [
                        'Without sugar, please.',
                        'Without ice, please.',
                        'With milk, please.',
                        'With sugar, please.',
                    ],
                ],
                [
                    'order_number' => 5,
                    'question_text' => '「ここで飲んでもいいですか？」を英語で言うと？',
                    'explanation' => 'Can I ...?で許可を求めます。hereは「ここで」という意味です。',
                    'correct_answer' => 'Can I drink this here?',
                    'answers' => [
                        'Can I take this home?',
                        'Can I drink this here?',
                        'Can I have the menu?',
                        'Can I order another drink?',
                    ],
                ],
            ];

            $this->seedQuestions($cafeLesson, $cafeQuestions);
        });
    }

    private function seedQuestions(Lesson $lesson, array $questions): void
    {
        foreach ($questions as $questionData) {
            $question = $lesson->questions()->firstOrCreate(
                [
                    'order_number' => $questionData['order_number'],
                ],
                [
                    'question_text' => $questionData['question_text'],
                    'question_type' => 'multiple_choice',
                    'explanation' => $questionData['explanation'],
                ],
            );

            foreach ($questionData['answers'] as $answerText) {
                $question->answers()->firstOrCreate(
                    [
                        'answer_text' => $answerText,
                    ],
                    [
                        'is_correct' => $answerText === $questionData['correct_answer'],
                    ],
                );
            }
        }
    }
}
