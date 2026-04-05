<?php

namespace Modules\Training\app\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Training\app\Models\TrainingCourse;
use Modules\Training\app\Models\TrainingSession;
use Modules\Training\app\Models\TrainingEnrollment;

class TrainingCourseController extends Controller
{
    public function index()
    {
        $courses = TrainingCourse::withCount('sessions')
            ->with('creator:id,name')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($c) => [
                'id'             => $c->id,
                'title'          => $c->title,
                'description'    => $c->description,
                'category'       => $c->category,
                'delivery_mode'  => $c->delivery_mode,
                'duration_hours' => $c->duration_hours,
                'provider'       => $c->provider,
                'cost'           => $c->cost,
                'status'         => $c->status,
                'sessions_count' => $c->sessions_count,
                'created_by'     => $c->creator?->name,
            ]);

        // Summary stats
        $stats = [
            'total_courses'      => TrainingCourse::where('status', 'active')->count(),
            'total_sessions'     => TrainingSession::count(),
            'total_enrollments'  => TrainingEnrollment::count(),
            'completions'        => TrainingEnrollment::where('status', 'completed')->count(),
        ];

        $categories = TrainingCourse::select('category')->distinct()->pluck('category')->filter()->values();

        return Inertia::render('training/Index', compact('courses', 'stats', 'categories'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'          => 'required|string|max:255',
            'description'    => 'nullable|string|max:2000',
            'category'       => 'nullable|string|max:100',
            'delivery_mode'  => 'required|in:online,in_person,hybrid',
            'duration_hours' => 'required|integer|min:0',
            'provider'       => 'nullable|string|max:255',
            'cost'           => 'required|numeric|min:0',
        ]);

        TrainingCourse::create([...$data, 'created_by' => $request->user()->id, 'status' => 'active']);

        return back()->with('success', 'Course created.');
    }

    public function update(Request $request, TrainingCourse $course)
    {
        $data = $request->validate([
            'title'          => 'required|string|max:255',
            'description'    => 'nullable|string|max:2000',
            'category'       => 'nullable|string|max:100',
            'delivery_mode'  => 'required|in:online,in_person,hybrid',
            'duration_hours' => 'required|integer|min:0',
            'provider'       => 'nullable|string|max:255',
            'cost'           => 'required|numeric|min:0',
            'status'         => 'required|in:active,inactive',
        ]);

        $course->update($data);

        return back()->with('success', 'Course updated.');
    }

    public function destroy(TrainingCourse $course)
    {
        $course->delete();
        return back()->with('success', 'Course deleted.');
    }
}
