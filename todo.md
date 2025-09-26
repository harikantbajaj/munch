# TODO: Remove Sign-in and Sign-up Pages and Enable Direct Home Page Access

- [x] Remove authentication check in `app/(root)/layout.tsx` to prevent redirect to `/sign-in`
- [x] Delete the entire `app/(auth)/` directory containing sign-in and sign-up pages
- [ ] Test the app to ensure home page loads directly without authentication
