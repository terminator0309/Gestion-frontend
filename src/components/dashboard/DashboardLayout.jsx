import { useState } from 'react';
import {
    AppShell,
    Navbar,
    Header,
    MediaQuery,
    Burger,
    useMantineTheme,
} from '@mantine/core';

export function DashboardLayout({DashboardBody, DashboardHeader, Sidebar}) {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    return (
        <AppShell
            styles={{
                main: {
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                },
            }}
            layout={"alt"}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            navbar={
                <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
                    <Sidebar isOpen={opened} close={() => setOpened(false)}/>
                </Navbar>
            }

            header={
                <Header height={{ base: 50, md: 70 }} p="md">
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                            <Burger
                                opened={opened}
                                onClick={() => setOpened((o) => !o)}
                                size="sm"
                                color={theme.colors.gray[6]}
                                mr="xl"
                            />
                        </MediaQuery>

                        <DashboardHeader />
                    </div>
                </Header>
            }
        >
            <DashboardBody />
        </AppShell>
    );
}