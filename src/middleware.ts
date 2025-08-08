import {clerkMiddleware, createRouteMatcher} from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

const ONBOARDING_ROUTE = '/users/onboarding';
const isOnboardingRoute = createRouteMatcher([ONBOARDING_ROUTE])
const isPublicRoute = createRouteMatcher(['/', '/testimonials', '/about', '/sign-in(.*)'])

export default clerkMiddleware(async (auth, req: NextRequest) => {
    const { userId, sessionClaims, redirectToSignIn } = await auth()
    // For users visiting /onboarding, don't try to redirect
    if (userId && isOnboardingRoute(req)) {
        return NextResponse.next()
    }

    // If the user isn't signed in and the route is private, redirect to sign-in
    if (!userId && !isPublicRoute(req)) {
        const redirectUrl = req.nextUrl.searchParams.get("redirect_url");
        const redirectPath = redirectUrl ? redirectUrl :'/';
        return redirectToSignIn({returnBackUrl: new URL(redirectPath, req.url).toString()})
    }

    // Catch users who do not have `onboardingComplete: true` in their publicMetadata
    // Redirect them to the /onboarding route to complete onboarding
    if (userId && !sessionClaims?.metadata?.onboardingComplete) {
        const onboardingUrl = new URL(ONBOARDING_ROUTE, req.url)
        return NextResponse.redirect(onboardingUrl)
    }

    // If the user is logged in and the route is protected, let them view.
    if (userId && !isPublicRoute(req)) return NextResponse.next()
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}