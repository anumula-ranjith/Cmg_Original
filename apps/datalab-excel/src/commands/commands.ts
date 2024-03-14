/**
 * Shows a notification when the add-in command is executed.
 * @param event
 */
function action(event: Office.AddinCommands.Event): void {
  const message: Office.NotificationMessageDetails = {
    type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
    message: 'Performed action.',
    icon: 'Icon.80x80',
    persistent: true,
  };

  // Show a notification message
  Office.context.mailbox.item?.notificationMessages.replaceAsync('action', message);

  // Be sure to indicate when the add-in command function is complete
  event.completed();
}

type IGlobal = {
  action: (event: Office.AddinCommands.Event) => void;
};

function getGlobal(): IGlobal {
  // eslint-disable-next-line no-restricted-globals -- Excel API requires global object
  const g = self as unknown as IGlobal;
  if (typeof g !== 'undefined') {
    return g;
  } else if (typeof window !== 'undefined') {
    return window as IGlobal;
  } else if (typeof global !== 'undefined') {
    return global as IGlobal;
  } else {
    throw new Error('Unable to locate global object.');
  }
}

const g = getGlobal();

// The add-in command functions need to be available in global scope
g.action = action;
