import React, { useEffect, useState, useCallback } from "react";

import {
  Box,
  Typography,
  Slider,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Divider,
  Chip,
} from "@mui/material";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import RefreshIcon from "@mui/icons-material/Refresh";

import NotificationCard from "../components/NotificationCard";

import { useNotifications } from "../hooks/useNotifications";

import {
  getTopN,
  getReadIds,
  markAsRead,
} from "../utils/notifications";

import {
  LogInfo,
  LogWarn,
  LogDebug,
} from "../utils/logger";


function PriorityInboxPage() {
  const {
    notifications,
    loading,
    error,
    fetchNotifications,
  } = useNotifications();

  const [topN, setTopN] = useState(10);

  const [typeFilter, setTypeFilter] = useState("");

  const [readIds, setReadIds] = useState(
    getReadIds
  );

  const [topNotifs, setTopNotifs] = useState([]);

  const loadAll = useCallback(() => {
    LogInfo(
      "page",
      `PriorityInboxPage: fetching notifications for scoring — topN=${topN}, type='${typeFilter || "all"}'`
    );

    fetchNotifications({
      limit: 100,
      page: 1,
      notification_type: typeFilter || undefined,
    });
  }, [fetchNotifications, topN, typeFilter]);


  useEffect(() => {
    LogInfo(
      "page",
      "PriorityInboxPage mounted — loading all notifications for priority scoring"
    );

    loadAll();
  }, []);


  // Recompute top-N whenever source data changes
  useEffect(() => {
    if (notifications.length === 0) return;

    LogDebug(
      "state",
      `PriorityInboxPage: recomputing priority inbox — ${notifications.length} notifications → top ${topN}`
    );

    const top = getTopN(
      notifications,
      topN,
      readIds
    );

    setTopNotifs(top);

    if (top.length < topN) {
      LogWarn(
        "state",
        `PriorityInboxPage: only ${top.length} unread notifications available — less than requested ${topN}`
      );
    } else {
      LogInfo(
        "state",
        `PriorityInboxPage: priority inbox ready — ${top.length} items`
      );
    }
  }, [notifications, topN, readIds]);


  const handleCardClick = (id) => {
    markAsRead(id);

    setReadIds(getReadIds());

    LogInfo(
      "component",
      `PriorityInboxPage: notification id=${id} marked read`
    );
  };


  const handleTopNChange = (_, value) => {
    const n = value;

    setTopN(n);

    LogDebug(
      "state",
      `PriorityInboxPage: top-N slider updated to ${n}`
    );
  };


  const handleTypeChange = (event) => {
    const value = event.target.value;

    setTypeFilter(value);

    LogInfo(
      "page",
      `PriorityInboxPage: type filter changed to '${value || "all"}'`
    );

    fetchNotifications({
      limit: 100,
      page: 1,
      notification_type: value || undefined,
    });
  };


  return (
    <Box>

      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        mb={2}
      >
        <EmojiEventsIcon
          color="warning"
          sx={{ fontSize: 28 }}
        />

        <Typography
          variant="h5"
          fontWeight={700}
        >
          Priority Inbox
        </Typography>

        <Chip
          label={`Top ${topN}`}
          color="primary"
          size="small"
        />
      </Box>


      <Typography
        variant="body2"
        color="text.secondary"
        mb={2.5}
      >
        Displays the most important
        <strong> unread </strong>
        notifications ranked by
        type weight × recency decay.
        Click a card to mark it as read.
      </Typography>


      {/* Controls */}
      <Box
        sx={{
          p: 2,
          mb: 3,
          background: "#f5f5f5",
          borderRadius: 2,

          display: "flex",

          flexDirection: {
            xs: "column",
            sm: "row",
          },

          gap: 3,

          alignItems: {
            xs: "stretch",
            sm: "flex-end",
          },
        }}
      >

        <Box flex={1} minWidth={200}>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={600}
          >
            Show top N:
            <strong> {topN}</strong>
          </Typography>

          <Slider
            value={topN}
            onChange={handleTopNChange}
            min={5}
            max={25}
            step={5}
            marks={[5, 10, 15, 20, 25].map((v) => ({
              value: v,
              label: String(v),
            }))}
            valueLabelDisplay="auto"
            size="small"
            sx={{ mt: 1.5 }}
          />
        </Box>


        <Stack
          direction="row"
          spacing={1}
          alignItems="flex-end"
        >
          <FormControl
            size="small"
            sx={{ minWidth: 140 }}
          >
            <InputLabel>Type</InputLabel>

            <Select
              value={typeFilter}
              label="Type"
              onChange={handleTypeChange}
            >
              <MenuItem value="">
                All Types
              </MenuItem>

              <MenuItem value="Placement">
                Placement
              </MenuItem>

              <MenuItem value="Result">
                Result
              </MenuItem>

              <MenuItem value="Event">
                Event
              </MenuItem>
            </Select>
          </FormControl>


          <Button
            size="small"
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadAll}
          >
            Refresh
          </Button>
        </Stack>
      </Box>


      <Divider sx={{ mb: 2 }} />


      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}


      {loading && (
        <Box
          display="flex"
          justifyContent="center"
          py={6}
        >
          <CircularProgress />
        </Box>
      )}


      {!loading &&
        !error &&
        topNotifs.length === 0 && (
          <Alert
            severity="success"
            icon={<EmojiEventsIcon />}
          >
            🎉 All caught up! No unread
            priority notifications.
          </Alert>
        )}


      {!loading &&
        topNotifs.map((notif, index) => (
          <NotificationCard
            key={notif.id}
            notification={notif}
            isNew={notif.isNew}
            score={notif.score}
            rank={index + 1}
            onClick={handleCardClick}
          />
        ))}


      {!loading &&
        topNotifs.length > 0 && (
          <Typography
            variant="caption"
            color="text.disabled"
            mt={1}
            display="block"
            textAlign="center"
          >
            Showing {topNotifs.length}
            {" "}of {topN} requested
          </Typography>
        )}
    </Box>
  );
}

export default PriorityInboxPage;