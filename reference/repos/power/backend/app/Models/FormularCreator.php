<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class FormularCreator extends Model
{
    use HasFactory, SoftDeletes;

    protected $with = ['configs'];

    protected $fillable = [
        'name',
        'description',
    ];

    protected $appends = ['backendClass'];

    public function getBackendClassAttribute(): string
    {
        return 'FormularCreator';
    }

    public static function getAllWithSearch($role_id, $with, $q)
    {
        $user = Auth::user();

        $formularCreators = FormularCreator::whereHas('formularRoles', function ($query) use ($role_id, $user) {
            $query->where('role_id', $role_id)
                ->whereHas('userRoles', function ($subQuery) use ($user, $role_id) {
                    // Join with UserRoles using an alias to avoid table name conflict
                    $subQuery->join('user_roles as ur', 'formular_creator_roles.role_id', '=', 'ur.role_id')
                        ->where('ur.user_id', $user->id)
                        ->where('ur.role_id', $role_id)
                        // Ensure area_id matches between UserRoles (aliased as 'ur') and FormularCreatorRoles
                        ->whereColumn('ur.area_id', 'formular_creator_roles.area_id');
                });
        })
            ->where('name', 'LIKE', "%{$q}%")
            ->orWhere('description', 'LIKE', "%{$q}%")
            ->with($with)
            ->distinct()
            ->get();

        abort_if($formularCreators->isEmpty(), 403, 'Formular Creator not found or access denied');

        return $formularCreators;
    }

    public static function getAllWith($role_id, $with)
    {
        $user = Auth::user();

        $formularCreators = FormularCreator::whereHas('formularRoles', function ($query) use ($role_id, $user) {
            $query->where('role_id', $role_id)
                ->whereHas('userRoles', function ($subQuery) use ($user, $role_id) {
                    // Join with UserRoles using an alias to avoid table name conflict
                    $subQuery->join('user_roles as ur', 'formular_creator_roles.role_id', '=', 'ur.role_id')
                        ->where('ur.user_id', $user->id)
                        ->where('ur.role_id', $role_id)
                        // Ensure area_id matches between UserRoles (aliased as 'ur') and FormularCreatorRoles
                        ->whereColumn('ur.area_id', 'formular_creator_roles.area_id');
                });
        })
            ->with($with)
            ->distinct()
            ->get();

        abort_if($formularCreators->isEmpty(), 403, 'Formular Creator not found or access denied');

        return $formularCreators;
    }

    public static function getOneWith($id, $role_id, $with)
    {
        $user = Auth::user();

        $formularCreator = FormularCreator::where('id', $id)
            ->whereHas('formularRoles', function ($query) use ($role_id, $user) {
                $query->where('role_id', $role_id)
                    ->whereHas('userRoles', function ($subQuery) use ($user, $role_id) {
                        // Join with UserRoles using an alias to avoid table name conflict
                        $subQuery->join('user_roles as ur', 'formular_creator_roles.role_id', '=', 'ur.role_id')
                            ->where('ur.user_id', $user->id)
                            ->where('ur.role_id', $role_id)
                            // Ensure area_id matches between UserRoles (aliased as 'ur') and FormularCreatorRoles
                            ->whereColumn('ur.area_id', 'formular_creator_roles.area_id');
                    });
            })
            ->with($with)
            ->distinct()
            ->first();

        abort_if(!$formularCreator, 403, 'Formular Creator not found or access denied');

        return $formularCreator;
    }

    public function elements(): HasMany
    {
        return $this->hasMany(FormularCreatorElements::class, 'formular_creator_id', 'id');
    }

    public function formulars(): HasMany
    {
        return $this->hasMany(Formular::class, 'formular_creator_id', 'id');
    }

    public function formularRoles(): HasMany
    {
        return $this->hasMany(FormularCreatorRoles::class, 'formular_creator_id', 'id');
    }

    public function configs(): HasMany
    {
        return $this->hasMany(FormularCreatorConfigs::class, 'formular_creator_id', 'id');
    }
}
