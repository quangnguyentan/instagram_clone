export type SignInCredential = {
    email: string
    password: string
}

export type SignInResponse = {
    accessToken: string
    user: {
        _id: string
        username: string
        role?: string
        roles?: string[]
        avatarUrl?: string | null
        email: string
    }
}

export type SignUpResponse = {
    _id: string
    username: string
    fullname: string
    email: string
}

export type SignUpCredential = {
    userName: string
    email: string
    password: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}

export type AuthRequestStatus = 'success' | 'failed' | ''

export type AuthResult = Promise<{
    status: AuthRequestStatus
    message: string
}>

export type User = {
    userId?: string | null
    avatar?: string | null
    userName?: string | null
    email?: string | null
    authority?: string[]
}

export type Token = {
    accessToken: string
    refereshToken?: string
}

export type OauthSignInCallbackPayload = {
    onSignIn: (tokens: Token, user?: User) => void
    redirect: () => void
}
