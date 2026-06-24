import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                        Enter your details below to get started
                    </CardDescription>
                    <CardAction>
                        <Button variant="link" asChild>
                            <a href="/sign-in">Sign In</a>
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <div className="grid gap-2">
                            <label htmlFor="name" className="text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <Input id="name" type="text" placeholder="John Doe" required />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <Input id="password" type="password" required />
                        </div>
                        <div className="grid gap-2">
                            <label
                                htmlFor="confirm-password"
                                className="text-sm font-medium text-gray-700"
                            >
                                Confirm Password
                            </label>
                            <Input id="confirm-password" type="password" required />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button
                        type="submit"
                        className="w-full bg-[#2a5b46] text-white hover:bg-[#1e4433]"
                    >
                        Create Account
                    </Button>
                    <Button variant="outline" className="w-full">
                        Sign up with Google
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
