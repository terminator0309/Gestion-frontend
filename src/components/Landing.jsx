import {
    createStyles,
    Image,
    Container,
    Title,
    Button,
    Group,
    Text,
    rem,
    Header,
} from '@mantine/core';
import {useNavigate} from "react-router-dom";
import {GithubIcon, MantineLogo} from '@mantine/ds';
import {IconArrowNarrowRight} from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
    inner: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: `calc(${theme.spacing.xl} * 4)`,
        paddingBottom: `calc(${theme.spacing.xl} * 4)`,
    },

    innerHeader: {
        height: rem(56),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    content: {
        maxWidth: rem(480),
        marginRight: `calc(${theme.spacing.xl} * 3)`,

        [theme.fn.smallerThan('md')]: {
            maxWidth: '100%',
            marginRight: 0,
        },
    },

    title: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontSize: rem(44),
        lineHeight: 1.2,
        fontWeight: 900,

        [theme.fn.smallerThan('xs')]: {
            fontSize: rem(28),
        },
    },

    control: {
        [theme.fn.smallerThan('xs')]: {
            flex: 1,
        },
    },

    image: {
        flex: 1,

        [theme.fn.smallerThan('md')]: {
            display: 'none',
        },
    },

    highlight: {
        position: 'relative',
        backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
        borderRadius: theme.radius.sm,
        padding: `${rem(4)} ${rem(12)}`,
    },
}));

function HeaderMenu() {
    const { classes } = useStyles();
    const navigate = useNavigate();

    return (
        <Header height={56} mb={120}>
            <Container>
                <div className={classes.innerHeader}>
                    <MantineLogo size={28}/>
                    <Group spacing={5} >
                        <Button variant={"outline"} radius={"xl"} onClick={() => navigate("/auth/login")}>Login</Button>
                        <Button radius={"xl"} onClick={() => navigate("/auth/signup")}>Sign Up</Button>
                    </Group>
                </div>
            </Container>
        </Header>
    );
}
function Landing() {
    const { classes } = useStyles();
    const navigate = useNavigate();

    return (
        <div>
            <HeaderMenu />
            <Container>
                <div className={classes.inner}>
                    <div className={classes.content}>
                        <Title className={classes.title}>
                            <span className={classes.highlight}>Gestion</span> brings <br /> all you tasks and teammates together.
                        </Title>
                        <Text color="dimmed" mt="md">
                            Keep everything in the same place—even if your team isn’t.
                        </Text>

                        <Group mt={30}>
                            <Button radius="xl" size="md"
                                    className={classes.control}
                                    onClick={() => navigate("/auth/signup")}
                                    rightIcon={<IconArrowNarrowRight />}>
                                Get started
                            </Button>
                            <Button variant="default" radius="xl" size="md" className={classes.control} leftIcon={<GithubIcon size={"20"}/>}>
                                 Source code
                            </Button>
                        </Group>
                    </div>
                    <Image src="https://ui.mantine.dev/_next/static/media/image.9a65bd94.svg" className={classes.image} />
                </div>
            </Container>
        </div>
    );
}
export default Landing;
