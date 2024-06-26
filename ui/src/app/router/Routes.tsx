import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom"
import App from "../../features/layouts/App"
import EventsDashboard from "../../features/events/dashboard/EventsDashboard"
import TestErrors from "../../features/events/errors/TestError"
import NotFound from "../../features/events/errors/NotFound"
import ServerError from "../../features/events/errors/ServerError"
import LoginForm from "../../features/events/users/LoginForm"
import Homepage from "../../features/homepage/Homepage"
import ProfilePage from "../../features/events/profiles/ProfilePage"

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            {path: '', element: <Homepage />},
            {path: '/events', element: <EventsDashboard />},
            {path: 'profile/:username', element: <ProfilePage />},
            {path: 'login', element: <LoginForm />},
            {path: 'errors', element: <TestErrors />},
            {path: 'not-found', element: <NotFound />},
            {path: '*', element: <Navigate replace to='/not-found' />},
            {path: 'server-error', element: <ServerError />},
            {path: 'errors', element: <TestErrors />},
        ]
    }
]

export const router = createBrowserRouter(routes)