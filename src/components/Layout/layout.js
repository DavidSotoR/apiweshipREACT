import { Outlet } from "react-router-dom"
import { Suspense } from "react"
import Header from "../Header/header"

export default function Layout() {
    return (
        <>
            <Header />
            <main>
                <Suspense fallback={<div>Loading...</div>}>
                    <Outlet />
                </Suspense>
            </main>
        </>
    )
}