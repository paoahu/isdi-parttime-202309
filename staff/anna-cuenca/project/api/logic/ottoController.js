import pkg from 'johnny-five'
const { Board, Servo, LCD } = pkg
import { Otto } from './otto.js'

const FORWARD = 1
const BACKWARD = -1
const LEFT = 1
const RIGHT = -1


class OttoController {
    constructor() {
        this.board = new Board()

        this.lcd = null


        this.otto = null

        this.board.on("ready", () => {
            this.lcd = new LCD({
                controller: "PCF8574A"
            })
            this.otto = new Otto({
                leftLegPin: 2,
                rightLegPin: 3,
                leftFootPin: 4,
                rightFootPin: 5,
                board: this.board
            })

            this.otto.init()
            this.sayHi("Otto está listo!")
        })
    }

    // sayHi(message) {
    //     return new Promise((resolve, reject) => {
    //         this.lcd.clear() // Asume que `this.lcd` ya está inicializado

    //         // Importación dinámica de lcd-scrolling
    //         import('lcd-scrolling').then(scrollModule => {
    //             const scroll = scrollModule.default

    //             // Configuración inicial de lcd-scrolling con tu objeto LCD
    //             scroll.setup({
    //                 lcd: this.lcd,
    //                 debug: false,
    //                 char_length: 16,
    //                 row: 2,
    //                 firstCharPauseDuration: 4000,
    //                 lastCharPauseDuration: 1000,
    //                 scrollingDuration: 300,
    //                 full: true
    //             })

    //             // Usar scroll.line para mostrar texto en líneas específicas con desplazamiento
    //             scroll.line(0, message)


    //             setTimeout(() => {
    //                 console.log('Message displayed with scrolling')
    //                 resolve()
    //             }, 5000); // esto luego lo quitaré
    //         }).catch(error => {
    //             console.error("Error al importar lcd-scrolling:", error)
    //             reject(error)
    //         })
    //     })


    // }

    async sayHi(message) {
        // Verificar si el LCD está inicializado
        if (!this.lcd) {
            console.error('LCD no está inicializado.')
            throw new Error('LCD no está inicializado.')
        }

        try {
            this.lcd.clear() // Limpiar el LCD

            // Importar el módulo lcd-scrolling dinámicamente
            const scrollModule = await import('lcd-scrolling')
            const scroll = scrollModule.default;

            // Configurar lcd-scrolling con el objeto LCD
            scroll.setup({
                lcd: this.lcd,
                debug: false,
                char_length: 16,
                row: 2,
                firstCharPauseDuration: 4000,
                lastCharPauseDuration: 1000,
                scrollingDuration: 300,
                full: true
            })

            // Mostrar el mensaje con desplazamiento en la primera línea
            scroll.line(0, message)

            // Opcional: Resolver la promesa después de un tiempo específico si es necesario
            // Por ahora, simplemente mostramos un mensaje en consola después de mostrar el mensaje con desplazamiento
            console.log('Message displayed with scrolling')

            // Si quieres limpiar el LCD después de un tiempo, puedes descomentar lo siguiente:
            /*
            setTimeout(() => {
                this.lcd.clear();
                console.log('LCD cleared after displaying the message.');
            }, 5000); // Ajusta este tiempo según necesites
            */
        } catch (error) {
            console.error("Error al importar o usar lcd-scrolling:", error)
            throw error; // Lanza el error para que pueda ser manejado por quien llame a sayHi
        }
    }

    clearLCD() {
        return new Promise((resolve, reject) => {
            try {
                this.lcd.clear() // Llama al método clear() del objeto LCD
                console.log('LCD cleared')
                resolve() // Resuelve la promesa indicando que la operación fue exitosa
            } catch (error) {
                console.error('Error clearing LCD:', error)
                reject(error) // Rechaza la promesa si hay un error
            }
        })
    }


    walkForward() {
        return new Promise((resolve, reject) => {
            if (!this.otto) {
                reject(new Error("Otto is not initialized"))
                return
            }
            this.otto.restartOscillators()
            this.otto.walk(4, 2000, FORWARD).then(() => {
                console.log('Otto walked!')
                resolve()
            }).catch(error => {
                console.error('Otto failed to walk:', error)
                reject(error)
            })
        })
    }

    //BAILE DE SERPIENTE -- GUARDAR ES DIVERTIDO //

    turnRight() {
        return new Promise((resolve, reject) => {
            console.log(`Turning right`)

            if (!this.otto) {
                reject(new Error("Otto is not initialized"))
                return
            }

            // Asegurándose de que estamos accediendo a los osciladores a través del objeto Otto.
            this.otto.oscillators.forEach((oscillator, index) => {
                if (index < 2) { // Solo ajustamos las piernas para el giro
                    const isRightLeg = index % 2 !== 0; // Identifica si es la pierna derecha
                    oscillator.setParameters({
                        amplitude: isRightLeg ? 20 : 40, // Reducir la amplitud para la pierna derecha
                        period: 600, // Un periodo más rápido para un giro ágil
                        phase: isRightLeg ? Math.PI / 2 : 0, // Fase desfasada para pierna derecha
                        offset: 90 // Offset neutral, ajustar si es necesario
                    })
                } else {
                    // Para los pies, podrías querer mantenerlos en una posición neutral o ajustar ligeramente
                    oscillator.setParameters({
                        amplitude: 0, // Los pies no se mueven o se mueven muy poco
                        period: 600,
                        phase: 0,
                        offset: 90
                    })
                }
                oscillator.start()
            })

            // Damos tiempo al robot para completar el giro antes de resolver la promesa
            setTimeout(() => {
                console.log('Otto has turned right')
                resolve()
            }, 600) // Ajusta este tiempo según la duración del giro que observes en pruebas
        })
    }

    // turnRight() {
    //     return new Promise((resolve, reject) => {
    //         console.log(`Attempting to turn left using left foot`);

    //         if (!this.otto) {
    //             reject(new Error("Otto is not initialized"));
    //             return;
    //         }

    //         // Asegurar que Otto esté en su estado 'home' inicial
    //         this.otto.home();

    //         // Ajustar solo el oscilador del pie izquierdo para realizar un movimiento que ayude al giro
    //         this.otto.oscillators[2].setParameters({
    //             amplitude: 45, // Ajustar según sea necesario
    //             period: 2000,   // Ajustar según sea necesario
    //             phase: 0,      // Generalmente 0 para empezar desde el inicio del ciclo
    //             offset: 90     // Posición inicial neutral
    //         });

    //         this.otto.oscillators[0].setParameters({
    //             amplitude: 45, // Ajustar según sea necesario
    //             period: 900,   // Ajustar según sea necesario
    //             phase: 0,      // Generalmente 0 para empezar desde el inicio del ciclo
    //             offset: 90     // Posición inicial neutral
    //         });

    //         //// Lado derecho quieto para que actúe de pivote

    //         this.otto.oscillators[3].setParameters({
    //             amplitude: 0, // Ajustar según sea necesario
    //             period: 900,   // Ajustar según sea necesario
    //             phase: 0,      // Generalmente 0 para empezar desde el inicio del ciclo
    //             offset: 90     // Posición inicial neutral
    //         });

    //         this.otto.oscillators[1].setParameters({
    //             amplitude: 0, // Ajustar según sea necesario
    //             period: 900,   // Ajustar según sea necesario
    //             phase: 0,      // Generalmente 0 para empezar desde el inicio del ciclo
    //             offset: 90     // Posición inicial neutral
    //         });



    //         // Iniciar el movimiento del pie izquierdo
    //         this.otto.oscillators[2].start();
    //         this.otto.oscillators[0].start();
    //         this.otto.oscillators[3].start();
    //         this.otto.oscillators[1].start();

    //         // Establecer un temporizador para detener el movimiento después de un cierto tiempo
    //         setTimeout(() => {
    //             // Detener todos los osciladores para evitar movimientos continuos no deseados
    //             this.otto.oscillators.forEach(oscillator => oscillator.stop());
    //             console.log('Attempted to turn left using left foot');
    //             this.otto.isOttoResting = true; // Marcar a Otto como en estado de descanso, si es relevante
    //             resolve();
    //         }, this.otto.oscillators[2].period); // Usar el periodo del oscilador del pie para determinar la duración del intento de giro
    //     });
    // }

    jump() {

        return new Promise((resolve, reject) => {
            if (!this.otto) {
                reject(new Error("Otto is not initialized"))
                return
            }

            // Asumiendo que has inicializado correctamente los servos en alguna parte de tu código
            const servoLeftLeg = new Servo(2) // Ejemplo, necesitas asegurarte de que esto se hace en el contexto adecuado
            const servoRightLeg = new Servo(3)
            const servoLeftFoot = new Servo(4) // Comentado por simplicidad, añade según sea necesario
            const servoRightFoot = new Servo(5)

            servoLeftLeg.to(90)
            servoRightLeg.to(90)
            servoLeftFoot.to(150) // Posición elevada para el pie izquierdo
            servoRightFoot.to(30)

            // Esperar un momento para completar el giro
            setTimeout(() => {
                // Asegúrate de devolver los servos a una posición neutral antes de caminar
                // Posiciones para "saltar"
                servoLeftLeg.to(90) // Mantener las piernas rectas
                servoRightLeg.to(90)
                servoLeftFoot.to(90) // Volver a la posición neutral para simular el salto
                servoRightFoot.to(90)

                console.log("Otto has jumped")
                resolve()

                // // Espera un poco antes de empezar a caminar para asegurar que los servos están en posición neutral
                // setTimeout(() => {
                //     // Llama a walkForward después de que el giro se ha completado
                //     servoLeftLeg.to(90);
                //     servoRightLeg.to(90);
                //     servoLeftFoot.to(90);
                //     servoRightFoot.to(90);
                //     console.log("Otto has jumped");
                //     resolve();
                // }, 2000); // Tiempo de espera para que los servos vuelvan a la posición neutral
            }, 2000) // Tiempo de espera para completar el giro, ajusta según sea necesario
        })

    }
    // turnRightAndWalkForward() {
    //     return new Promise((resolve, reject) => {
    //         if (!this.otto) {
    //             reject(new Error("Otto is not initialized"));
    //             return;
    //         }

    //         // Asumiendo que has inicializado correctamente los servos en alguna parte de tu código
    //         const servoLeftLeg = new Servo(2); // Ejemplo, necesitas asegurarte de que esto se hace en el contexto adecuado
    //         const servoRightLeg = new Servo(3);
    //         const servoLeftFoot = new Servo(4); // Comentado por simplicidad, añade según sea necesario
    //         const servoRightFoot = new Servo(5);

    //         // Posicionar los servos para girar a la derecha
    //         // Los ángulos son ejemplos, ajusta según la mecánica de tu robot
    //         servoLeftLeg.to(45); // Mover pierna izquierda hacia un ángulo que inicie el giro
    //         servoRightLeg.to(45); // Mover pierna derecha en dirección opuesta para facilitar el giro
    //         servoLeftFoot.to(45)

    //         // Esperar un momento para completar el giro
    //         setTimeout(() => {
    //             // Asegúrate de devolver los servos a una posición neutral antes de caminar
    //             servoLeftLeg.to(90);
    //             servoRightLeg.to(90);

    //             // Espera un poco antes de empezar a caminar para asegurar que los servos están en posición neutral
    //             setTimeout(() => {
    //                 // Llama a walkForward después de que el giro se ha completado
    //                 this.walkForward().then(() => {
    //                     console.log('Otto turned right and walked forward!');
    //                     resolve();
    //                 }).catch(error => {
    //                     console.error('Otto failed to turn right and walk:', error);
    //                     reject(error);
    //                 });
    //             }, 1000); // Tiempo de espera para que los servos vuelvan a la posición neutral
    //         }, 2000); // Tiempo de espera para completar el giro, ajusta según sea necesario
    //     });
    // }

    //se devía a la izquierda
    walkBackward() {
        return new Promise((resolve, reject) => {
            if (!this.otto) {
                reject(new Error("Otto is not initialized"))
                return
            }
            this.otto.walkBackward(4, 2000, BACKWARD).then(() => {
                console.log('Otto walked backward!')
                resolve()
            }).catch(error => {
                console.error('Otto failed to walk backward:', error)
                reject(error)
            })
        })
    }




    // walkBackward(steps, period) {
    //     return new Promise((resolve, reject) => {
    //         if (!this.otto) {
    //             reject(new Error("Otto is not initialized"))
    //             return
    //         }
    //         console.log('Otto attempting to walk backward')


    //         this.otto.oscillators.forEach((oscillator, index) => {
    //             const adjustment = index % 2 === 0 ? 0 : -5
    //             oscillator.setParameters({
    //                 amplitude: 30 + adjustment,
    //                 period: period,
    //                 phase: Math.PI,
    //                 offset: 90 + adjustment
    //             })
    //             oscillator.start()
    //         })

    //         setTimeout(() => {
    //             console.log('Otto walked backward!')
    //             resolve()
    //         }, period * steps)
    //     })
    // }

    stop() {
        return new Promise((resolve, reject) => {
            if (!this.otto) {
                reject(new Error("Otto is not initialized"))
                return
            }

            this.otto.stopServos()
            resolve()
        })
    }
}

export default OttoController