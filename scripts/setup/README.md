# PostgreSQL Setup:

Use schema.sql to setup everything. Additionally a trigger can be added, to call the function `handle_new_user` when an insert on auth.users appears. (Creating a new profile for new users)

```
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```
