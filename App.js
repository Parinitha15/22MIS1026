import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useMediaQuery,
  Badge,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

import AllNotificationsPage from "./pages/AllNotificationsPage";
import PriorityInboxPage from "./pages/PriorityInboxPage";

import { LogInfo } from "./utils/logger";


// ─── Theme ─────────────────────────────────────────────

const theme = createTheme({
  palette: {
    primary: { main: "#1565c0" },
    secondary: { main: "#6a1b9a" },
    background: {
      default: "#f0f4f8",
      paper: "#ffffff",
    },
  },

  typography: {
    fontFamily: "'Inter', sans-serif",

    h5: {
      fontWeight: 700,
    },

    h6: {
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 10,
  },

  components: {
    MuiCard: {
      defaultProps: {
        elevation: 2,
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});


// ─── Navigation ───────────────────────────────────────

function NavContent() {
  const location = useLocation();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("sm")
  );

  const [mobileNav, setMobileNav] = useState(
    location.pathname === "/priority" ? 1 : 0
  );

  const navItems = [
    {
      label: "All",
      icon: <NotificationsIcon />,
      path: "/",
    },

    {
      label: "Priority",
      icon: <EmojiEventsIcon />,
      path: "/priority",
    },
  ];

  LogInfo(
    "component",
    `App: route changed to ${location.pathname}`
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={2}
        sx={{ background: "#1565c0" }}
      >
        <Toolbar>
          <Badge
            badgeContent="BETA"
            color="warning"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "0.55rem",
                right: -14,
                top: 8,
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.5px",
              }}
            >
              🎓 CampusNotify
            </Typography>
          </Badge>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box
              ml="auto"
              display="flex"
              gap={1}
            >
              {navItems.map((item) => (
                <Box
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    px: 2,
                    py: 0.75,
                    borderRadius: 2,
                    color: "#fff",
                    textDecoration: "none",

                    fontWeight:
                      location.pathname === item.path
                        ? 700
                        : 400,

                    background:
                      location.pathname === item.path
                        ? "rgba(255,255,255,0.2)"
                        : "transparent",

                    "&:hover": {
                      background:
                        "rgba(255,255,255,0.12)",
                    },

                    fontSize: "0.9rem",
                    transition: "background 0.2s",
                  }}
                >
                  {item.icon}
                  {item.label}
                </Box>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="md"
        sx={{
          py: { xs: 2, sm: 3 },
          pb: { xs: 10, sm: 3 },
        }}
      >
        <Routes>
          <Route
            path="/"
            element={<AllNotificationsPage />}
          />

          <Route
            path="/priority"
            element={<PriorityInboxPage />}
          />
        </Routes>
      </Container>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
          }}
          elevation={4}
        >
          <BottomNavigation
            value={mobileNav}
            onChange={(_, value) =>
              setMobileNav(value)
            }
          >
            {navItems.map((item, index) => (
              <BottomNavigationAction
                key={item.path}
                component={Link}
                to={item.path}
                label={item.label}
                icon={item.icon}
                value={index}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </>
  );
}


// ─── Main App ─────────────────────────────────────────

function App() {
  LogInfo(
    "component",
    "App: CampusNotify React application initialised and rendering"
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <Box
          minHeight="100vh"
          bgcolor="background.default"
        >
          <NavContent />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;