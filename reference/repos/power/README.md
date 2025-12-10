# Install
### Backend
```
Install Laravel
Install Sanctum 
    -> Frontend should call /sanctum/csrf-cookie
    -> Then call /login
    -> Axios should have withCredentials = true
    -> Rest is setup in backend
Install Breeze with API
    -> Makes the /resgister and /login etc.
```
### Frontend
```
npm run start
```

# Backend
Re-installing XAMPP usually solves the problem with the MySQL not starting.
Current install -> C:\xampp\82\mysql

# Access
User hasMany 
UserRoles 
-> user_roles
    -> user_id  User
                -> user
                    -> 
    -> role_id  Role
                -> role
                    -> name
                    -> access
    -> area_id  Area
                -> area
                    -> version
                    -> name
                    -> parent

Areas are a grouping in all datasets and views.

Role has Many
RoleFeatures
-> role_feature
    -> role_id
    -> feature_id   Feature
                    -> feature
                        -> name
                        -> parent

Features points to a dataset, view or hierarchical functions.

    
    