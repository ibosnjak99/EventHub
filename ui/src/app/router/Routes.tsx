import { createBrowserRouter, RouteObject } from "react-router-dom"
import App from "../layouts/App"
import EventsDashboard from "../../features/events/dashboard/EventsDashboard"
import EventDetails from "../../features/events/dashboard/EventModal"

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            {path: '', element: <EventsDashboard />},
            {path: 'events/:id', element: <EventDetails />},
        ]
    }
]

export const router = createBrowserRouter(routes)