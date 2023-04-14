import { createBrowserRouter, RouteObject } from "react-router-dom"
import App from "../layouts/App"
import EventsDashboard from "../../features/events/dashboard/EventsDashboard"

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            {path: 'events', element: <EventsDashboard />}
        ]
    }
]

export const router = createBrowserRouter(routes)