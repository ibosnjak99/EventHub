import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom"
import App from "../layouts/App"
import EventsDashboard from "../../features/events/dashboard/EventsDashboard"
import EventDetails from "../../features/events/dashboard/EventModal"
import TestErrors from "../../features/events/errors/TestError"
import NotFound from "../../features/events/errors/NotFound"
import ServerError from "../../features/events/errors/ServerError"
import LoginForm from "../../features/events/users/LoginForm"
import Homepage from "../../features/homepage/Homepage"

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            {path: '', element: <Homepage />},
            {path: '/events', element: <EventsDashboard />},
            {path: 'events/:id', element: <EventDetails />},
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