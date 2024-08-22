export interface DialogConfig<T> {
    data?: T;
    width?: string;
    height?: string;
};

export interface DialogResult<T> {
    success: boolean;
    data?: T;
};

export enum dialogCssClasses {
    mobileFriendlyClass = 'mobile-like-dialog',
    tabFriendlyClass = 'tab-friendly-dialog',
    fullScreenClass = 'full-screen-dialog',
    transformClass = 'transform-dialog',
}

export enum AlertDialogType {
    Info = 1,
    Success = 2,
    Warning = 3,
    Error = 4,
}

export interface AlertDialogData {
    hasCancel: boolean,
    alertType: AlertDialogType,
    title: string,
    dialogName?: string;
    message: string,
}
