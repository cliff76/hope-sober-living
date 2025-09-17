export {}

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            onboardingComplete?: boolean
        }
    }

    interface UserPublicMetadata {
        roles?: string[]
    }
}