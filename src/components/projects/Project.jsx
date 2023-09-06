import { useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getProject, postComment} from "../../redux/projects/projectThunk.js";
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
    Modal,
    TextInput,
    SegmentedControl,
    Checkbox,
    Textarea,
    Box,
    rem,
    Paper,
    TypographyStylesProvider,
    ThemeIcon,
    Tooltip
} from '@mantine/core';
import {
    IconAlignJustified,
    IconCalendarDue, IconCheck,
    IconChecklist, IconEdit,
    IconLayoutCards, IconMessage2,
    IconPlus,
    IconTrash,
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
    },

    todoItemGroup: {
        transition: 'all 0.2s ease',
        borderRadius: "10px",
        padding: '7px',

        ':hover' : {
            transform: 'scale(1.02)',
            backgroundColor: 'aliceblue'
        }
    },

    todoItemIcon: {
        color: "grey",
        cursor: "pointer",
        transition: 'all 0.1s ease',

        ':hover' :{
            transform: 'scale(1.1)'
        }
    },
        todoItemEditIcon: {
            '&:hover' :{
                color: `${theme.colors.blue[7]}`
            }
        },
        todoItemDeleteIcon: {
            '&:hover': {
                color: `${theme.colors.red[7]}`
            }
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

const Header = ({project}) => {
    const[opened, {open, close}] = useDisclosure(false)

    const createCardForm = useForm({
        initialValues: {
            title: "",
            description: "",
            deadline: "",
            priority: "0"
        }
    })

    const createCardFormSubmit = () => {

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

const EditCardTodoItem = ({todoItem, index, editCardForm}) => {
    const {classes, cx} = useStyles();
    const [editTodoItemTask, setEditTodoItemTask] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const toggleEditTodoItemTask = () => {
        setEditTodoItemTask(!editTodoItemTask);
    }

    const removeTodoItem = () => {
        editCardForm.removeListItem('todo', index);
    }

    const CheckboxLabel = () => {
        return (
            <Text strikethrough={todoItem.isChecked}
                  color={todoItem.isChecked && "dimmed"}>
                {todoItem.task}
            </Text>
        )
    }

    const saveOnEnter = (event) => {
        if(event.key === "Enter") {
            toggleEditTodoItemTask();
        }
    }

    return (
        <Group position={"apart"}
               className={classes.todoItemGroup}
               onMouseEnter={() => setIsHovered(true)}
               onMouseLeave={() => setIsHovered(false)}>
            {editTodoItemTask
                ?
                <TextInput rightSection={
                                <ThemeIcon size={"1.3rem"}>
                                    <IconCheck onClick={toggleEditTodoItemTask} />
                                </ThemeIcon>}
                           onKeyDown={saveOnEnter}
                           {...editCardForm.getInputProps(`todo.${index}.task`)} />
                :
                <Checkbox
                    label={<CheckboxLabel />}
                    checked={todoItem.isChecked}

                    {...editCardForm.getInputProps(`todo.${index}.isChecked`, {type: "checkbox"})} /> }


            {isHovered &&
                <Group>
                    <Tooltip label={"Edit"} withArrow>
                        <IconEdit size={"1.2rem"}
                                  onClick={toggleEditTodoItemTask}
                                  className={cx(classes.todoItemIcon, classes.todoItemEditIcon)}/>
                    </Tooltip>

                    <Tooltip label={"Delete"} withArrow>
                        <IconTrash size={"1.2rem"}
                                   onClick={removeTodoItem}
                                   className={cx(classes.todoItemIcon, classes.todoItemDeleteIcon)}/>
                    </Tooltip>

                </Group>
            }
        </Group>
    )
}


const EditCardModal = ({opened, close, card}) => {
    const {classes} = useStyles();
    const {projectId} = useParams();
    const username = useSelector(state => state.authSlice.user.username)
    const dispatch = useDispatch();

    const editCardForm = useForm({
        initialValues: {
            ...card,
            priority: card.priority.toString(),
            todo: [...card.todo.map(item => ({...item}))]
        }
    });

    const [comment, setComment] = useState("");
    const [isOpenAddItemInput, setIsOpenAddItemInput] = useState(false);
    const [addItemInputValue, setAddItemInputValue] = useState("");

    const [inputsVariant, setInputsVariant] = useState({
        title: "unstyled",
        description: "unstyled"
    })

    const countCompletedTasks = () => {
        return editCardForm.values.todo.reduce((count, todoItem) => count + todoItem.isChecked, 0);
    }

    let taskProgress = (countCompletedTasks() / editCardForm.values.todo.length) * 100;

    const addTodoItemAndClose = () => {
        if(!addItemInputValue)
            return;

        editCardForm.insertListItem("todo", {
            isChecked: false,
            task: addItemInputValue
        })

        setIsOpenAddItemInput(false);
        setAddItemInputValue("");
    }


    const submitPostCommentForm = (e) => {
        e.preventDefault();

        dispatch(postComment({comment, username, cardId: card._id, projectId}));

        setComment("")
    }

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

                {/* CHECKLIST */}

                <Box style={{display: "flex", alignItems: "center"}} mt={"md"}>
                    <IconChecklist />
                    <Text span fw={600} fz={"sm"} ml={"xs"}>Checklist</Text>
                </Box>

                <Box ml={"2.2rem"}>
                    <Progress mt={"sm"} mb={"xs"} value={taskProgress} color={taskProgress === 100 ? 'teal' : 'blue'} />

                    {/* CHECKLIST ITEMS */}

                    {editCardForm.values.todo.map((todoItem, index) => (
                        <EditCardTodoItem key={index}
                                          todoItem={todoItem}
                                          editCardForm={editCardForm}
                                          index={index} />
                    ))}

                    <Box>
                        {isOpenAddItemInput ? (
                            <>
                                <TextInput placeholder={"Add item to checklist..."}
                                           mb={"xs"}
                                           mt={"xs"}
                                           value={addItemInputValue}
                                           onKeyDown={(event) => event.key === "Enter" && addTodoItemAndClose()}
                                           onChange={(event) => setAddItemInputValue(event.currentTarget.value)}/>

                                <Button onClick={addTodoItemAndClose} disabled={!addItemInputValue}>Add</Button>
                                <Button variant={"default"}
                                        onClick={() => setIsOpenAddItemInput(false)}
                                        ml={"xs"}>
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsOpenAddItemInput(true)}
                                    mt={"xs"}
                                    variant={"light"}>
                                Add item
                            </Button>
                        )}
                    </Box>
                </Box>
            </form>


            {/* CARD COMMENTS */}
            <Box style={{display: "flex", alignItems: "center"}} mt={"md"}>
                <IconMessage2 />
                <Text span fw={600} fz={"sm"} ml={"xs"}>Activity</Text>
            </Box>

            {/* SEND COMMENT INPUT */}

            <form onSubmit={submitPostCommentForm}>
                <TextInput placeholder={"Write a comment..."}
                           mt={"md"}
                           value={comment}
                           onChange={(event) => setComment(event.currentTarget.value)}/>
                <Button type="submit"
                        radius={"xl"}
                        mt={"xs"}
                        style={{transition: "all 0.3s ease"}}
                        disabled={comment.length === 0}>Comment</Button>
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

const Body = ({project}) => {
    const [opened, {open, close}] = useDisclosure(false);
    const [selectedCard, selectCard] = useState();
    const {classes} = useStyles();


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


const Sidebar = () => {
    return (
        <div>This is sidebar</div>
    )
}

const ComponentWrapper = (Component, basicProps={}) => {
    const WrappedComponent = (props) => {
        return (
            <Component {...basicProps} {...props} />
        )
    }

    WrappedComponent.displayName = "WrappedComponent";
    return WrappedComponent;
}

function Project() {
    const {projectId} = useParams();
    const dispatch = useDispatch();
    const project = useSelector(state => state.projectSlice.projects.filter(project => project._id === projectId)[0])

    // IF NOT PROJECT; 404 NOT FOUND

    useEffect(() => {
        dispatch(getProject(projectId))
    },[])


    return (
        <DashboardLayout DashboardBody={ComponentWrapper(Body, {project})}
                         DashboardHeader={ComponentWrapper(Header, {project})}
                         Sidebar={ComponentWrapper(Sidebar)} />
    );
}

export default Project;
