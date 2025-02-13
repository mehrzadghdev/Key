export interface DialogConfig<T> {
    data?: T;
    width?: string;
    height?: string;
};

export interface DialogResult<T> {
    success: boolean;
    data?: T;
};

export enum DialogCSSClasses {
    ResponsiveDialog = 'mobile-like-dialog',
    FullHeightDialog = 'tab-friendly-dialog',
    FullScreenDialog = 'full-screen-dialog',
    TransfromDialog = 'transform-dialog',
    WindowDialog = 'window-dialog',

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
