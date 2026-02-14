import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { authClient } from "./lib/authClient"
import { useNavigate } from 'react-router'

export function LoginForm({
    className,
    onSwitchForm,
    ...props
}: React.ComponentProps<"div"> & { onSwitchForm: () => void }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const handleSubmit: React.ComponentProps<"form">["onSubmit"] = async (e) => {
        e.preventDefault()
        const { error } = await authClient.signIn.email({ email, password })
        if (error) alert(error.message)
        else navigate("/new")
    }

    return (
        <div className={cn("flex flex-col gap-6 w-full max-w-md", className)} {...props}>
            <Card className="bg-amber-50/60 backdrop-blur-md border-amber-200/60 shadow-md">
                <CardHeader>
                    <CardTitle className="text-stone-800">Login to your account</CardTitle>
                    <CardDescription className="text-stone-500">
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Field>
                            <Field>
                                <Button type="submit">
                                    Login
                                </Button>
                                <FieldDescription className="text-center">
                                    Don&apos;t have an account? <a href="#" className="text-green-600 hover:text-green-500" onClick={(e) => { e.preventDefault(); onSwitchForm() }}>Sign up</a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}