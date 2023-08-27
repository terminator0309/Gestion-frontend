import {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import {createProject, getProjects} from "../../redux/projects/projectThunk";
import {useNavigate, useOutletContext} from "react-router-dom";
import {
    Card,
    Avatar,
    Text,
    Badge,
    Group,
    ActionIcon,
    SimpleGrid,
    createStyles,
    Button,
    TextInput,
    useMantineTheme, List, ThemeIcon, Modal, Textarea
} from '@mantine/core';
import {IconPlus, IconUpload, IconSearch, IconArrowRight, IconArrowLeft, IconPointFilled} from '@tabler/icons-react';
import {DashboardLayout} from "../dashboard/DashboardLayout.jsx";
import {useDisclosure} from "@mantine/hooks";
import {hasLength, useForm} from "@mantine/form";

const avatars = [
    'https://avatars.githubusercontent.com/u/10353856?s=460&u=88394dfd67727327c1f7670a1764dc38a8a24831&v=4',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
];
const useStyles = createStyles((theme) => ({
    card: {
        transition: 'transform 150ms ease, box-shadow 150ms ease',

        '&:hover': {
            transform: 'scale(1.01)',
            boxShadow: theme.shadows.md,
        },
    }}
));

const PriorityIcon = ({color}) => {
    return (
        <ThemeIcon color={color || "blue"} variant={"outline"} style={{border: 0}}>
            <IconPointFilled />
        </ThemeIcon>
    );
}


function TaskCard({project, selectProject, navigate, classes}) {
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 0: return "green";
            case 1: return "orange";
            case 2: return "red";
            default: return "lightblue";
        }
    }

    return (
        <Card withBorder
              padding="lg"
              radius="md"
              className={classes.card}
              onClick={() => {
                    selectProject(project);
                    navigate(`/dashboard/${project._id}`);
              }}>

            <Text fz="lg" fw={500}>
                {project.title}
            </Text>

            <Badge>12 days left</Badge>

            <List size={"sm"} c="dimmed" mt={"sm"} center={true}>
                {project.cards.map(card => (
                    <List.Item
                        key={card._id}
                        icon={<PriorityIcon color={getPriorityColor(card.priority)}/>}
                    >
                        {card.title}
                    </List.Item>
                ))}
            </List>

            <Group position="apart" mt="md">
                <Avatar.Group spacing="sm">
                    <Avatar src={avatars[0]} radius="xl" />
                    <Avatar src={avatars[1]} radius="xl" />
                    <Avatar src={avatars[2]} radius="xl" />
                    <Avatar radius="xl">+5</Avatar>
                </Avatar.Group>
                <ActionIcon variant="default">
                    <IconUpload size="1.1rem" />
                </ActionIcon>
            </Group>
        </Card>
    );
}

function InputWithButton(props) {
    const theme = useMantineTheme();

    return (
        <TextInput
            icon={<IconSearch size="1.1rem" stroke={1.5} />}
            autoFocus={true}
            radius="xl"
            size="md"
            rightSection={
                <ActionIcon size={32} radius="xl" color={theme.primaryColor} variant="filled">
                    {theme.dir === 'ltr' ? (
                        <IconArrowRight size="1.1rem" stroke={1.5} />
                    ) : (
                        <IconArrowLeft size="1.1rem" stroke={1.5} />
                    )}
                </ActionIcon>
            }
            placeholder="Search questions"
            rightSectionWidth={42}
            {...props}
        />
    );
}
function ProjectList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const projects = useSelector((state) => state.projectSlice.projects);
    const {selectProject} = useOutletContext();
    const {classes} = useStyles();
    const [searchProject, setSearchProject] = useState("");

    console.log("projectlist loaded");

    useEffect(() => {
        dispatch(getProjects());
    },[]);

    const Body = () => {
        const pattern = new RegExp(searchProject);

        return (
            <div>
                <SimpleGrid cols={4} breakpoints={[
                    { maxWidth: 'lg', cols: 3, spacing: 'md' },
                    { maxWidth: 'md', cols: 2, spacing: 'sm' },
                    { maxWidth: 'sm', cols: 1, spacing: 'sm' },
                ]}>
                    {projects?.map((project) => (
                        (pattern.test(project.title) &&
                        <TaskCard key={project._id}
                                  project={project}
                                  navigate={navigate}
                                  selectProject={selectProject}
                                  classes={classes} />)
                    ))}
                </SimpleGrid>
            </div>
        )
    }

    const Header = () => {
        const[opened, {open, close}] = useDisclosure(false);
        const createProjectForm = useForm({
            initialValues: {
                title: "",
                description: ""
            },
            validate: {
                title: hasLength({min: 5, max:50}, "Project title must be 5-50 characters long.")
            }
        })

        const createProjectFormSubmit = (values) => {
            if(createProjectForm.validate().hasErrors)
                return;

            dispatch(createProject(values))
        }

        return (
            <div style={{width: "100%"}}>
                <Group position={"apart"}>

                    <Group>
                        <Text fw={700} fz={"lg"}>Projects</Text>
                        <InputWithButton
                            type={"text"}
                            placeholder={"Search projects"}
                            value={searchProject}
                            onChange={(e) => setSearchProject(e.currentTarget.value)}
                        />
                    </Group>
                    <Button radius={"xl"}
                            rightIcon={<IconPlus size={"20"}/>}
                            onClick={open}>
                        Create new Project
                    </Button>
                    <Modal opened={opened} onClose={close} title={"Create New Project"}>
                        <form onSubmit={createProjectForm.onSubmit(createProjectFormSubmit)}>
                            <TextInput label={"Title"}
                                       placeholder={"your project title"}
                                       required
                                       mt={"sm"}
                                       {...createProjectForm.getInputProps("title")} />

                            <Textarea label={"Description"}
                                      placeholder={"your project description"}
                                      mt={"sm"}
                                      {...createProjectForm.getInputProps("description")} />

                            <Group mt={"sm"} position={"right"}>
                                <Button type={"submit"} radius={"xl"} >Create</Button>
                                <Button onClick={close} variant={"default"} radius={"xl"} >Cancel</Button>
                            </Group>

                        </form>
                    </Modal>
                </Group>

            </div>
        )
    }

    const Sidebar = () => {
        return (
            <div>
                Sidebar
            </div>
        )
    }

    return (
        <DashboardLayout DashboardHeader={Header}
                         DashboardBody={Body}
                         Sidebar={Sidebar}/>
    );
}

ProjectList.whyDidYouRender = true;

export default ProjectList;
