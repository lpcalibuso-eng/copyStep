<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\User\Notification;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();
        
        // Load user with role relationship if user is authenticated
        if ($user) {
            $user->load('role');
        }
        
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'notifications' => $user 
                    ? Notification::where('archive', 0)
                        ->orderBy('created_at', 'desc')
                        ->get()
                    : [],
            ],
        ];
    }
}