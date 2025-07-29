import {clerkClient, clerkMiddleware, createRouteMatcher} from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

const ONBOARDING_ROUTE = '/users/onboarding';
const isOnboardingRoute = createRouteMatcher([ONBOARDING_ROUTE])
const isPublicRoute = createRouteMatcher(['/', '/testimonials', '/about', '/sign-in(.*)'])

export default clerkMiddleware(async (auth, req: NextRequest) => {
    const { userId, sessionClaims, redirectToSignIn } = await auth()
    const client = await clerkClient();
    const updatedUser = userId ? await client?.users?.getUser(userId) : null;

    console.log('Middleware: request url ', req.url, ' user id ', userId, ' session claims ', sessionClaims);
    // For users visiting /onboarding, don't try to redirect
    if (userId && isOnboardingRoute(req)) {
        console.log('Middleware: request is onboarding route no further processing required');
        return NextResponse.next()
    }

    // If the user isn't signed in and the route is private, redirect to sign-in
    if (!userId && !isPublicRoute(req)) {
        console.log('Redirecting to sign-in');
        return redirectToSignIn({returnBackUrl: req.url})
    }

    // Catch users who do not have `onboardingComplete: true` in their publicMetadata
    // Redirect them to the /onboarding route to complete onboarding
    if (userId && !updatedUser?.publicMetadata?.onboardingComplete) {
        console.log('Redirecting to onboarding...');
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