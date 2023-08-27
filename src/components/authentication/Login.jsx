import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/authentication/authThunks";
import {Link, Navigate} from "react-router-dom";
import { getTokenFromLocalStorage } from "../../utils/token";

import {
    TextInput,
    PasswordInput,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Button,
} from '@mantine/core';
import {isEmail, useForm} from "@mantine/form";


export default function Login() {
    const dispatch = useDispatch();
    const loginForm = useForm({
        initialValues: {
            email: "",
            password: ""
        },
        validate: {
            email: isEmail("Invalid email")
        }
    })

    const isUserLoggedIn = useSelector((state) => state.authSlice.isLoggedIn);

    const handleSubmit = (values) => {
        if(loginForm.validate().hasErrors)
            return;

        dispatch(loginUser(values));
    };

    // Redirects user to dashboard after login
    if (isUserLoggedIn && getTokenFromLocalStorage().isPresent) {
        return <Navigate to="/dashboard" />;
    }

    return (

        <Container size={420} my={40}>

            {/* LOGIN HEADER */}

            <Title
                align="center"
                sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
            >
                Welcome back!
            </Title>
            <Text color="dimmed" size="sm" align="center" mt={5}>
                Do not have an account yet?{' '}
                <Anchor size="sm" component="button">
                    <Link to={"/auth/signup"}>
                        Create account
                    </Link>

                </Anchor>
            </Text>

            {/* LOGIN FORM */}

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={loginForm.onSubmit(handleSubmit)}>

                    <TextInput
                        label="Email"
                        placeholder="you@email.com"
                        required
                        {...loginForm.getInputProps('email')}/>

                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        required mt="md"
                        {...loginForm.getInputProps("password")}/>

                    <Button fullWidth mt="xl" type={"submit"}>
                        Login
                    </Button>

                </form>
            </Paper>
        </Container>
    );
}
