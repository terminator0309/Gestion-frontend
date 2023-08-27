import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../redux/authentication/authThunks";
import {Link, Navigate} from "react-router-dom";
import {
    TextInput,
    PasswordInput,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
    Box,
    Progress,
    Center
} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import {hasLength, isEmail, matchesField, useForm} from "@mantine/form";
import {getTokenFromLocalStorage} from "../../utils/token.js";

function PasswordRequirement({ meets, label }) {
    return (
        <Text color={meets ? 'teal' : 'red'} mt={5} size="sm">
            <Center inline>
                {meets ? <IconCheck size="0.9rem" stroke={1.5} /> : <IconX size="0.9rem" stroke={1.5} />}
                <Box ml={7}>{label}</Box>
            </Center>
        </Text>
    );
}

const requirements = [
    { re: /[0-9]/, label: 'Includes number' },
    { re: /[a-z]/, label: 'Includes lowercase letter' },
    { re: /[A-Z]/, label: 'Includes uppercase letter' },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];


// Returns password strength in percentage for these 5 requirements
function getStrength(password) {
    let multiplier = password.length > 5 ? 0 : 1;

    requirements.forEach((requirement) => {
        if (!requirement.re.test(password)) {
            multiplier += 1;
        }
    });

    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

function PasswordStrength({value}) {
    const strength = getStrength(value);
    const checks = requirements.map((requirement, index) => (
        <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(value)} />
    ));
    const bars = Array(4)
        .fill(0)
        .map((_, index) => (
            <Progress
                styles={{ bar: { transitionDuration: '100ms' } }}
                value={
                    value.length > 0 && index === 0 ? 100 : strength >= ((index + 1) / 4) * 100 ? 100 : 0
                }
                color={strength > 80 ? 'teal' : strength > 50 ? 'yellow' : 'red'}
                key={index}
                size={4}
            />
        ));

    return (
        <div>
            <Group spacing={5} grow mt="xs" mb="md">
                {bars}
            </Group>

            <PasswordRequirement label="Has at least 6 characters" meets={value.length > 5} />
            {checks}
        </div>
    );
}

function Signup() {
    const isUserLoggedIn = useSelector((state) => state.authSlice.isLoggedIn);
    const dispatch = useDispatch();

    const signupForm = useForm({
        initialValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        validate: {
            username: hasLength({min: 2, max: 20}, 'Username must be 2-20 characters long'),
            email: isEmail('Invalid email'),
            password: (value) => getStrength(value) !== 100,
            confirmPassword: matchesField('password', 'Passwords are not the same')
        }
    })


    const handleSubmit = (values) => {
        if(signupForm.validate().hasErrors)
            return;

        dispatch(signupUser(values));
    };

    if (isUserLoggedIn && getTokenFromLocalStorage().isPresent) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <Container size={420} my={40}>

            {/* SIGNUP HEADER */}

            <Title
                align="center"
                sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
            >
                Welcome to Gestion!
            </Title>
            <Text color="dimmed" size="sm" align="center" mt={5}>
                Already have an account?{' '}
                <Anchor size="sm" component="button">
                    <Link to={"/auth/login"}>
                        Login
                    </Link>
                </Anchor>
            </Text>

            {/*SIGNUP FORM*/}

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={signupForm.onSubmit(handleSubmit)}>

                    <TextInput
                        label="Username"
                        placeholder="your name"
                        required
                        {...signupForm.getInputProps('username')}/>

                    <TextInput
                        label="Email"
                        placeholder="you@email.com"
                        required mt="md"
                        {...signupForm.getInputProps('email')}/>

                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        required mt="md"
                        {...signupForm.getInputProps('password')}/>

                    {signupForm.isTouched('password') && <PasswordStrength value={signupForm.values.password}/>}

                    <PasswordInput
                        label="Confirm password"
                        placeholder="confirm your password"
                        required
                        mt="md"
                        {...signupForm.getInputProps('confirmPassword')}/>

                    <Button fullWidth mt="xl" onClick={handleSubmit}>
                        Sign in
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

export default Signup;
