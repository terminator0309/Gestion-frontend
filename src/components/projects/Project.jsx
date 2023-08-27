import { useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getProject} from "../../redux/projects/projectThunk.js";
import {
    Card,
    Avatar,
    Text,
    Progress,
    Badge,
    Group,
    ActionIcon,
    SimpleGrid,
    createStyles,
    Button,
    Modal, TextInput, SegmentedControl, Checkbox, Textarea, Box, rem, Paper, TypographyStylesProvider
} from '@mantine/core';
import {
    IconAlignJustified,
    IconCalendarDue,
    IconChecklist,
    IconLayoutCards, IconMessage2,
    IconPlus,
    IconUpload,
    IconUrgent
} from '@tabler/icons-react';
import {DashboardLayout} from "../dashboard/DashboardLayout.jsx";
import {useDisclosure} from "@mantine/hooks";
import {useForm} from "@mantine/form";
import {DateInput} from "@mantine/dates";

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
    },
    comment: {
        padding: `${theme.spacing.sm} ${theme.spacing.sm}`,
        marginTop: `${theme.spacing.md}`
    },
    content: {
        '& > p:last-child': {
            marginBottom: 0,
        },
    },
    commentBody: {
        paddingLeft: rem(54),
        paddingTop: theme.spacing.sm,
        fontSize: theme.fontSizes.sm,
    }
}
));


function TaskCard({card, classes, onClick}) {
    const totalTasks = card.todo.length;
    const completedTasks = card.todo.reduce((count, todoItem) => {
        if(todoItem.isChecked)
            count++;
        return count;
    }, 0);

    return (
        <Card withBorder
              onClick={onClick}
              padding="lg"
              radius="md"
              className={classes.card}>

            <Text fz="lg" fw={500}>
                {card.title}
            </Text>

            <Badge>12 days left</Badge>

            <Text fz="sm" c="dimmed" mt={"sm"}>
                {card.description}
            </Text>

            <Text c="dimmed" fz="sm" mt="md">
                Tasks completed:{' '}
                <Text
                    span
                    fw={500}
                    sx={(theme) => ({ color: theme.colorScheme === 'dark' ? theme.white : theme.black })}
                >
                    {completedTasks}/{totalTasks}
                </Text>
            </Text>

            <Progress value={(completedTasks / totalTasks) * 100} mt={5} />

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
function Project() {
    const {projectId} = useParams();
    const dispatch = useDispatch();
    const project = useSelector(state => state.projectSlice.projects.filter(project => project._id === projectId)[0])
    const {classes} = useStyles();

    // IF NOT PROJECT; 404 NOT FOUND

    useEffect(() => {
        dispatch(getProject(projectId))
    },[])

    const PriorityButtonGroup = ({form}) => {
        return (
            <>
                <Text mt={"md"} fw={600} fz={"sm"}>Priority</Text>
                <SegmentedControl data={[
                                            {value: "0", label: "Low"},
                                            {value: "1", label: "Medium"},
                                            {value: "2", label: "High"}
                                        ]}
                                  transitionDuration={400}
                                  transitionTimingFunction="ease"
                                  mt={"sm"}
                                  color={form.values.priority === "0" ? 'green' :
                                         form.values.priority === "1" ? 'yellow' : 'red'}
                                  {...form.getInputProps("priority")} />
            </>

        )
    }

    const EditCardModal = ({opened, close, card}) => {
        const editCardForm = useForm({
            initialValues: {
                ...card,
                priority: card.priority.toString(),
                todo: [...card.todo.map(item => ({...item}))]
            }
        });

        const [comment, setComment] = useState("");

        const countCompletedTasks = () => {
            return editCardForm.values.todo.reduce((count, todoItem) => count + todoItem.isChecked, 0);
        }

        let taskProgress = (countCompletedTasks() / editCardForm.values.todo.length) * 100;

        const [inputsVariant, setInputsVariant] = useState({
            title: "unstyled",
            description: "unstyled"
        })

        return (
            <Modal opened={opened} onClose={close} withCloseButton={false} size={"lg"}>
                <form>
                    <Group position={"apart"}>
                        <Box style={{display: "flex", alignItems: "center"}}>
                            <IconLayoutCards />
                            <TextInput
                                variant={inputsVariant.title}
                                {...editCardForm.getInputProps("title")}
                                ml={"xs"}
                                styles={{input: {transition: "all 0.3s ease", border: 0, fontWeight: 600, fontSize: "1.2rem"}}}
                                onFocus={() => setInputsVariant(state => ({...state, title : "filled"}))}
                                onBlur={() => setInputsVariant(state => ({...state, title : "unstyled"}))}/>
                        </Box>
                        <Modal.CloseButton />

                    </Group>

                    <Box style={{display: "flex", alignItems: "center"}}>
                        <IconAlignJustified style={{marginBottom: "2.7rem"}}/>
                        <Textarea label={"Description"}
                              variant={inputsVariant.description}
                              {...editCardForm.getInputProps("description")}
                              mt={"md"}
                              ml={"xs"}
                              styles={{input: {transition: "all 0.3s ease", border: 0}, root: {width: "100%"}}}
                              onFocus={() => setInputsVariant(state => ({...state, description : "filled"}))}
                              onBlur={() => setInputsVariant(state => ({...state, description : "unstyled"}))}/>
                    </Box>


                    <Box style={{display: "flex", alignItems: "center"}}>
                        <IconUrgent style={{marginBottom: "2.2rem"}}/>
                        <Box component={"div"} ml={"xs"}>
                            <PriorityButtonGroup form={editCardForm}/>
                        </Box>

                    </Box>


                    <Box style={{display: "flex", alignItems: "center"}} mt={"md"}>
                        <IconChecklist />
                        <Text span fw={600} fz={"sm"} ml={"xs"}>Checklist</Text>
                    </Box>

                    <Box ml={"2.2rem"}>
                        <Progress mt={"sm"} value={taskProgress} color={taskProgress === 100 ? 'teal' : 'blue'} />

                        {editCardForm.values.todo.map((todoItem, index) => (
                            <Checkbox key={todoItem._id}
                                      label={<Text strikethrough={todoItem.isChecked}
                                                   color={todoItem.isChecked && "dimmed"}>
                                                {todoItem.task}
                                            </Text>}
                                      checked={todoItem.isChecked}
                                      mt={"sm"}
                                      {...editCardForm.getInputProps(`todo.${index}.isChecked`, {type: "checkbox"})} />
                        ))}
                    </Box>
                </form>


                {/* CARD COMMENTS */}
                <Box style={{display: "flex", alignItems: "center"}} mt={"md"}>
                    <IconMessage2 />
                    <Text span fw={600} fz={"sm"} ml={"xs"}>Activity</Text>
                </Box>

                {/* SEND COMMENT INPUT */}

                <form>
                    <TextInput placeholder={"Write a comment..."}
                               mt={"md"}
                               value={comment}
                               onChange={(event) => setComment(event.currentTarget.value)}/>
                    <Button radius={"xl"} mt={"xs"} style={{transition: "all 0.3s ease"}} disabled={comment.length === 0}>Comment</Button>
                </form>


                {editCardForm.values.comments.map(comment => (
                    <Paper key={comment._id} withBorder radius="md" className={classes.comment}>
                        <Group>
                            <Avatar alt={comment.name} radius="xl" />
                            <div>
                                <Text fz="sm">{comment.name}</Text>
                                <Text fz="xs" c="dimmed">
                                    Put time here
                                </Text>
                            </div>
                        </Group>
                        <TypographyStylesProvider className={classes.commentBody}>
                            <div className={classes.content} dangerouslySetInnerHTML={{ __html: comment.comment }} />
                        </TypographyStylesProvider>
                    </Paper>
                ))}


            </Modal>
        )
    }

    const Body = () => {
        const [opened, {open, close}] = useDisclosure(false);
        const [selectedCard, selectCard] = useState();

        return (
                <SimpleGrid cols={4} breakpoints={[
                    { maxWidth: 'lg', cols: 3, spacing: 'md' },
                    { maxWidth: 'md', cols: 2, spacing: 'sm' },
                    { maxWidth: 'sm', cols: 1, spacing: 'sm' },
                ]}>
                    {project?.cards.map(card => (
                        <TaskCard key={card._id}
                                  card={card}
                                  classes={classes}
                                  onClick={() => {
                                      selectCard(card);
                                      open();
                                  }}/>
                    ))}
                    {selectedCard && <EditCardModal opened={opened} close={close} card={selectedCard} />}
                </SimpleGrid>
        )
    }

    const Header = () => {
        const[opened, {open, close}] = useDisclosure(false)

        const createCardForm = useForm({
            initialValues: {
                title: "",
                description: "",
                deadline: "",
                priority: "0"
            }
        })

        const createCardFormSubmit = (values) => {

        }

        return (
            <div style={{width: "100%"}}>
                <Group position={"apart"}>
                    <Text fz={"lg"} fw={700}>Project: {project.title}</Text>

                    <Button radius={"xl"}
                            rightIcon={<IconPlus size={"20"}/>}
                            onClick={open}>
                        Create New Card
                    </Button>
                </Group>

                <Modal opened={opened}
                       onClose={close}
                       title={<Text fw={700} fz={"lg"}>Create New Card</Text>}
                       styles={{ content: { overflow: "visible !important;" } }}>
                    <form onSubmit={createCardForm.onSubmit(createCardFormSubmit)}>
                        <TextInput label={"Title"}
                                   required
                                   placeholder={"your card title"}
                                   mt={"sm"}
                                   {...createCardForm.getInputProps("title")} />

                        <TextInput label={"Description"}
                                   placeholder={"add a description to the card"}
                                   mt={"sm"}
                                   {...createCardForm.getInputProps("description")} />

                        <DateInput label={"Deadline"}
                                   minDate={new Date()}
                                   placeholder={"set a deadline"}
                                   mt={"sm"}
                                   icon={<IconCalendarDue size={"0.8rem"} />}
                                   {...createCardForm.getInputProps("deadline")} />

                        <PriorityButtonGroup form={createCardForm} />

                        <Group position={"right"} mt={"md"}>
                            <Button type={"submit"} radius={"xl"}>Create</Button>
                            <Button onClick={close} radius={"xl"} variant={"default"}>Cancel</Button>
                        </Group>
                    </form>
                </Modal>
            </div>
        )
    }

    const Sidebar = () => {
        return (
            <div>This is sidebar</div>
        )
    }

    return (
        <DashboardLayout DashboardBody={Body}
                         DashboardHeader={Header}
                         Sidebar={Sidebar} />
    );
}

export default Project;
