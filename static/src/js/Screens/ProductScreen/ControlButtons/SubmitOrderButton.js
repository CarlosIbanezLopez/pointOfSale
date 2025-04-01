

// odoo.define('pos_restaurant.SubmitOrderButton', function(require) {
//     'use strict';

//     const PosComponent = require('point_of_sale.PosComponent');
//     const ProductScreen = require('point_of_sale.ProductScreen');
//     const Registries = require('point_of_sale.Registries');

//     /**
//      * IMPROVEMENT: Perhaps this class is quite complicated for its worth.
//      * This is because it needs to listen to changes to the current order.
//      * Also, the current order changes when the selectedOrder in pos is changed.
//      * After setting new current order, we update the listeners.
//      */
//     class SubmitOrderButton extends PosComponent {
//         setup() {
//             super.setup();
//             this.clicked = false; //mutex, we don't want to be able to spam the printers
//         }
//         async _onClick() {
//             if (!this.clicked) {
//                 try {
//                     this.clicked = true;
//                     const order = this.env.pos.get_order();
//                     if (order.hasChangesToPrint()) {
//                         const isPrintSuccessful = await order.printChanges();
//                         if (isPrintSuccessful) {
//                             order.updatePrintedResume();
                            
//                         } else {
//                             console.log('asdfasdf')
//                             console.log(order.updatePrintedResume());
//                             this.showPopup('ErrorPopup', {
//                                 title: this.env._t('Printing failed'),
//                                 body: this.env._t('Failed in printing the changes in the order'),
//                             });
//                         }
//                     }
//                 } finally {
//                     this.clicked = false;
//                 }
//             }
//         }
//         get currentOrder() {
//             return this.env.pos.get_order();
//         }
//         get addedClasses() {
//             if (!this.currentOrder) return {};
//             const hasChanges = this.currentOrder.hasChangesToPrint();
//             const skipped = hasChanges ? false : this.currentOrder.hasSkippedChanges();
//             return {
//                 highlight: hasChanges,
//                 altlight: skipped,
//             };
//         }
//     }
//     SubmitOrderButton.template = 'SubmitOrderButton';

//     ProductScreen.addControlButton({
//         component: SubmitOrderButton,
//         condition: function() {
//             return this.env.pos.config.module_pos_restaurant && this.env.pos.unwatched.printers.length;
//         },
//     });

//     Registries.Component.add(SubmitOrderButton);

//     return SubmitOrderButton;
// });

        // async _onClick() {
        //     if (!this.clicked) {
        //         try {
        //             this.clicked = true;
        
        //             let receipt = document.querySelector('.printable-receipt-new');
        
        //             if (receipt) {
        //                 let printArea = receipt.cloneNode(true);
        //                 let win = window.open('', '', 'width=800,height=600');
        //                 win.document.write('<html><head><title>Impresión</title></head><body>');
        //                 win.document.write(printArea.outerHTML);
        //                 win.document.write('</body></html>');
        //                 win.document.close();
        //                 win.onload = () => {
        //                     win.print();
        //                 };
        
        //                 win.onafterprint = () => {
        //                     win.close();
        //                 };
        //             } else {
        //                 console.error("No se encontró el recibo.");
        //             }
        //         } finally {
        //             this.clicked = false;
        //         }
        //     }
        // }

        //ESTO FUNCIONA BIEN PERO CON LA FECHA DEL VALIDATION_DATE OSEA CON LA DE ODOO EN LA CUAL SE ESTA GUARDANDO EN LA BS
        
        // async _onClick() {
        //     if (!this.clicked) {
        //         try {
        //             this.clicked = true;
        
        //             let receipt = document.querySelector('.printable-receipt-new');
        
        //             if (receipt) {
        //                 let printArea = receipt.cloneNode(true);
        
        //                 // Obtener la fecha de validación de la orden
        //                 let order = this.currentOrder;
        //                 if (order && order.validation_date) {
        //                     let utcDate = new Date(order.validation_date); // Convertir UTC a objeto Date
        //                     let localDate = utcDate.toLocaleString(); // Convertir a la hora local del usuario
        
        //                     // Crear el HTML para la fecha
        //                     let formattedDate = `<h4 style="font-weight: bold;">Fecha: ${localDate}</h4>`;
        
        //                     // Insertar la fecha al inicio del recibo
        //                     printArea.insertAdjacentHTML("afterbegin", formattedDate);
        //                 }
        
        //                 let win = window.open('', '', 'width=800,height=600');
        //                 win.document.write('<html><head><title>Impresión</title></head><body>');
        //                 win.document.write(printArea.outerHTML);
        //                 win.document.write('</body></html>');
        //                 win.document.close();
        
        //                 win.onload = () => {
        //                     win.print();
        //                 };
        
        //                 win.onafterprint = () => {
        //                     win.close();
        //                 };
        //             } else {
        //                 console.error("No se encontró el recibo.");
        //             }
        //         } finally {
        //             this.clicked = false;
        //         }
        //     }
        // }

odoo.define('pos_restaurant.SubmitOrderButton', function(require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const Registries = require('point_of_sale.Registries');
    const { nextFrame } = require('point_of_sale.utils');

    class SubmitOrderButton extends PosComponent {
        setup() {
            super.setup();
            this.clicked = false; // Evitar múltiples clics seguidos
        }

        

    // ESTO SERA CON LA FECHA DE LA PC DEL USUARIO
        async _onClick() {
            if (!this.clicked) {
                try {
                    this.clicked = true;
        
                    let receipt = document.querySelector('.printable-receipt-new');
        
                    if (receipt) {
                        let printArea = receipt.cloneNode(true);
        
                        // Obtener la fecha y hora actual de la computadora del usuario
                        let now = new Date();
                        let localDate = now.toLocaleString(); // Fecha y hora en formato local
        
                        // Crear el HTML para la fecha
                        let formattedDate = `<h4 style="font-weight: bold;">Fecha: ${localDate}</h4>`;
        
                        // Insertar la fecha al inicio del recibo
                        printArea.insertAdjacentHTML("afterbegin", formattedDate);
        
                        let win = window.open('', '', 'width=800,height=600');
                        win.document.write('<html><head><title>Impresión</title></head><body>');
                        win.document.write(printArea.outerHTML);
                        win.document.write('</body></html>');
                        win.document.close();
        
                        win.onload = () => {
                            win.print();
                        };
        
                        win.onafterprint = () => {
                            win.close();
                        };
                    } else {
                        console.error("No se encontró el recibo.");
                    }
                } finally {
                    this.clicked = false;
                }
            }
        }
        


        // Para que el template pueda acceder a la orden actual:
        get currentOrder() {
            console.warn('currentOrder');
            console.log(this.env.pos.get_order());
            return this.env.pos.get_order();
        }

        // Añade clases CSS si lo deseas
        get addedClasses() {
            if (!this.currentOrder) return {};
            const hasChanges = this.currentOrder.hasChangesToPrint();
            return { highlight: hasChanges };
        }
    }

    // Asignar el template
    SubmitOrderButton.template = 'SubmitOrderButton';

    // Agregarlo como un botón extra en la pantalla de productos
    ProductScreen.addControlButton({
        component: SubmitOrderButton,
        condition: function() {
            // Muestra el botón si existe el módulo restaurant
            // o según la condición que tú quieras
            return this.env.pos.config.module_pos_restaurant;
        },
    });

    Registries.Component.add(SubmitOrderButton);

    return SubmitOrderButton;
});
