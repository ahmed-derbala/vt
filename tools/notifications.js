let notSeenNotifications = exports.notSeenNotifications = (UserId) => {
    let where = {}
    where.isSeen = false
    where.isDeleted = false
    where.UserId = UserId
    return models.Notification.findAll({
        where,
        order: [
            ['id', 'DESC'],
        ]
    })
        .then(notifications => {
            io.sockets.in(`user_${UserId}`).emit('receiveNotSeenNotifications', { messages: `you have ${notifications.length} notifications`, data: notifications })
            return log().debug({ message: colors.bgMagenta(`[receiveNotSeenNotifications] user.id=${UserId} received ${notifications.length} Not Seen Notifications`) })
        })
        .catch(err => {
            console.log(colors.bgRed(err));
            return log().error({ message: err });
        })
}


exports.sendNotification = (UserId, SenderId, type, TypeId, subject, text, data, user) => {
    return models.Notification.create({
        UserId,
        //ReceiverId,
        SenderId,
        type,
        TypeId,
        subject,
        text,
        isSeen: false,
        isDeleted: false,
    })
        .then(notification => {
            //sending notification
            io.sockets.in(`user_${UserId}`).emit('newNotification', {
                subject,
                message: text,
                data
            });
            notSeenNotifications(UserId)
            if (user != null) {
                return log(UserId).debug({ message: `[notification_received] id=${notification.id} user.id=${user.id} ${user.email} role=${user.role} GroupId=${user.GroupId} subject=${subject}` });
            } else {
                return log(UserId).debug({ message: `[notification_received] id=${notification.id} user.id=${UserId} subject=${subject}` });
            }
        })
        .catch(err => {
            console.log(colors.bgRed(err));
            return log().error({ message: err, route: 'tools/sendNotification' });
        })
}


//number of connected clietns in given room to check if a user still connected to the app
exports.NumClientsInRoom = (namespace, room) => {
    let clients = io.nsps[namespace].adapter.rooms[room];
    if (clients) {
        console.log(`NumClientsInRoom ${room}   ${clients.length}`);
        return Object.keys(clients).length;
    } else {
        console.log(`NumClientsInRoom ${room}   0`);
        return 0
    }
}
