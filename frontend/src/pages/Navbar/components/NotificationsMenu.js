import {
  Box,
  IconButton,
  Badge,
  Popover,
  Typography,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from "@mui/material";
import { Notifications as NotificationsFilled, NotificationsNoneOutlined } from "@mui/icons-material";

const NotificationsMenu = ({
  notificationsAnchor,
  handleOpenNotifications,
  handleCloseNotifications,
  handleMarkAllRead,
  notifications,
  darkThemeStyles,
}) => {
  return (
    <>
      <Badge
        badgeContent={notifications.length}
        color="error"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <IconButton
          onClick={handleOpenNotifications}
          sx={{ color: notifications.length ? "#1976d2" : "#b0b0b0" }}
        >
          {notifications.length ? (
            <NotificationsFilled />
          ) : (
            <NotificationsNoneOutlined />
          )}
        </IconButton>
      </Badge>
      <Popover
        disableScrollLock
        id="notifications-popover"
        open={Boolean(notificationsAnchor)}
        anchorEl={notificationsAnchor}
        onClose={handleCloseNotifications}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            bgcolor: darkThemeStyles.background,
            minWidth: 320,
            maxWidth: 400,
            boxShadow: 3,
            borderRadius: 2,
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${darkThemeStyles.borderColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" fontWeight={700} color={darkThemeStyles.color}>
            Notifications
          </Typography>
          {notifications.length > 0 && (
            <Button
              size="small"
              onClick={handleMarkAllRead}
              sx={{ color: "#1976d2", fontWeight: 600 }}
            >
              Mark all as read
            </Button>
          )}
        </Box>
        <List sx={{ maxHeight: 320, overflowY: "auto", p: 0 }}>
          {notifications.length === 0 ? (
            <ListItem sx={{ justifyContent: "center", py: 4 }}>
              <Typography color="#7b8ba3">No notifications</Typography>
            </ListItem>
          ) : (
            notifications.map((notification, index) => (
              <ListItem
                alignItems="flex-start"
                key={index}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom: `1px solid ${darkThemeStyles.borderColor}`,
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: "#e3f2fd",
                      color: "#1976d2",
                      width: 32,
                      height: 32,
                    }}
                  >
                    <NotificationsFilled fontSize="small" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography fontWeight={600} color={darkThemeStyles.color}>
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="#7b8ba3">
                        {notification.body}
                      </Typography>
                      {notification.timestamp && (
                        <Typography
                          variant="caption"
                          color="#b0b0b0"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          {new Date(notification.timestamp).toLocaleString()}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </Popover>
    </>
  );
};

export default NotificationsMenu; 