from operator import truediv
from turtle import right
from anyio import sleep_forever
from fastapi import FastAPI
import threading
import RPi.GPIO as GPIO          
from time import sleep, time

#region ***  Global variable declarations             ***********
global headX
global headY
global eyesX
global eyesY

global wink_left_status
global wink_right_status
global wink_both_status
global center_head
global emma_sleep

wink_left_status = 0
wink_right_status = 0
wink_both_status = 1
center_head = 0
emma_sleep = 0

global PositionCounterX
global PositionCounterY

PositionCounterX = 0
PositionCounterY = 0

global prevStatusX
global prevStatusY

prevStatusX = 0
prevStatusY = 0

global setMinX
global setMaxX
global setMinY
global setMaxY

setMinX = 0
setMaxX = 0
setMinY = 0
setMaxY = 0

global PositionMinX
global PositionMaxX
global PositionMinY
global PositionMaxY

PositionMinX = 0
PositionMaxX = 30
PositionMinY = 0
PositionMaxY = 30

headX = 1
headY = 1
eyesX = 1
eyesY = 1
#endregion

#region ***  GPIO pin declarations                    ***********
in1 = 24
in2 = 23
en = 25
in3 = 13
in4 = 19
en2 = 26

servoPIN1 = 17
servoPIN2 = 21
servoPIN3 = 20
servoPIN4 = 18

encoderXPin = 6
encoderYPin = 5
MinButtonX = 14
MaxButtonX = 15
#endregion

#region ***  Callback functions                       ***********
def min_button_callback_x(pin):
    global PositionCounterX
    global setMinX

    setMinX = 1
    PositionCounterX = 0
    
    print(f"Min value button x {PositionCounterX}")

def max_button_callback_x(pin):
    global PositionCounterX
    global PositionMaxX
    global setMaxX

    setMaxX = 1
    PositionMaxX = PositionCounterX
    print(f"Max value button x {PositionCounterX}")

def min_button_callback_y(pin):
    global PositionCounterY
    print(f"Min value button y {PositionCounterY}")

def max_button_callback_y(pin):
    global PositionCounterY
    print(f"Max value button y {PositionCounterY}")

def read_motor_callback_x(pin):
    global PositionCounterX
    global prevStatusX

    CurrentX = GPIO.input(encoderXPin)

    if CurrentX != prevStatusX:
        if headX < 0 and PositionCounterX > PositionMinX:
            PositionCounterX -= 1

        elif headX > 0 and PositionCounterX < PositionMaxX:
            PositionCounterX += 1
    
    prevStatusX = CurrentX

    # print(f"headX {PositionCounterX}")

def read_motor_callback_y(pin):
    global PositionCounterY
    global prevStatusY

    CurrentY = GPIO.input(encoderYPin)

    if CurrentY != prevStatusY:
        if headY < 0 and PositionCounterY > PositionMinY:
            PositionCounterY -= 1

        elif headY > 0 and PositionCounterY < PositionMaxY:
            PositionCounterY += 1
    
    prevStatusY = CurrentY
    # print(f"headY {PositionCounterY}")
    
#endregion

#region ***  GPIO pin setup                           ***********

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)

GPIO.setup(encoderXPin, GPIO.IN)
GPIO.setup(encoderYPin, GPIO.IN)
GPIO.setup(MinButtonX, GPIO.IN, GPIO.PUD_UP)
GPIO.setup(MaxButtonX, GPIO.IN, GPIO.PUD_UP)

GPIO.setup(in1,GPIO.OUT)
GPIO.setup(in2,GPIO.OUT)
GPIO.setup(en,GPIO.OUT)
GPIO.output(in1,GPIO.LOW)
GPIO.output(in2,GPIO.LOW)

GPIO.setup(in3,GPIO.OUT)
GPIO.setup(in4,GPIO.OUT)
GPIO.setup(en2,GPIO.OUT)
GPIO.output(in3,GPIO.LOW)
GPIO.output(in4,GPIO.LOW)

GPIO.setup(servoPIN1, GPIO.OUT)
GPIO.setup(servoPIN2, GPIO.OUT)
GPIO.setup(servoPIN3, GPIO.OUT)
GPIO.setup(servoPIN4, GPIO.OUT)

PWM_motor_1=GPIO.PWM(en,1000)
PWM_motor_1.start(75)

PWM_motor_2=GPIO.PWM(en2,1000)
PWM_motor_2.start(75)

Servo_PWM_1 = GPIO.PWM(servoPIN1, 50) 
Servo_PWM_2 = GPIO.PWM(servoPIN2, 50) 
Servo_PWM_3 = GPIO.PWM(servoPIN3, 50) 
Servo_PWM_4 = GPIO.PWM(servoPIN4, 50) 

Servo_PWM_1.start(1)
Servo_PWM_2.start(1)
Servo_PWM_3.start(1)
Servo_PWM_4.start(1)

GPIO.add_event_detect(MinButtonX, GPIO.FALLING, min_button_callback_x, bouncetime=200)
GPIO.add_event_detect(MaxButtonX, GPIO.FALLING, max_button_callback_x, bouncetime=200)
GPIO.add_event_detect(encoderXPin, GPIO.FALLING ,read_motor_callback_x, bouncetime= 100)
GPIO.add_event_detect(encoderYPin, GPIO.FALLING, read_motor_callback_y, bouncetime= 100)
#endregion

app = FastAPI()

def testInput():
    try:
        def printPositions():
            global headX
            global headY
            global eyesX
            global eyesY
            print(f"Input head ({headX}, {headY}) | Input eyes ({eyesX}, {eyesY})")

        while True:
            printPositions()
            sleep(1)

    except IOError as e:
        pass
    except KeyboardInterrupt:
        GPIO.cleanup()
        exit()

def start():
    global PositionMaxX
    global center_head

    while setMinX == False:
        GPIO.output(in1,GPIO.HIGH)
        GPIO.output(in2,GPIO.LOW)
        PWM_motor_1.ChangeDutyCycle(20)

    GPIO.output(in1,GPIO.LOW)
    GPIO.output(in2,GPIO.LOW)

    while setMaxX == False:
        GPIO.output(in1,GPIO.LOW)
        GPIO.output(in2,GPIO.HIGH)
        PWM_motor_1.ChangeDutyCycle(20)

    PositionMaxX = PositionCounterX
    GPIO.output(in1,GPIO.LOW)
    GPIO.output(in2,GPIO.LOW)
    print(MaxButtonX)

    center_head = 1

def controlMovementHead():
    try:
        while True:
            global headX
            global headY
            global PositionCounterX
            global PositionCounterY
            global center_head
            global emma_sleep

            global PositionMinX
            global PositionMaxX
            global PositionMinY
            global PositionMaxY

            if emma_sleep == 0:


                if center_head == 1:
                    print(f"{PositionCounterX} - {PositionCounterY}")
                    if PositionCounterX < (PositionMaxX / 2):
                        headX = 1
                        GPIO.output(in1,GPIO.HIGH)
                        GPIO.output(in2,GPIO.LOW)
                        PWM_motor_1.ChangeDutyCycle(20)

                    elif PositionCounterX > (PositionMaxX / 2):
                        headX = -1
                        GPIO.output(in1,GPIO.LOW)
                        GPIO.output(in2,GPIO.HIGH)
                        PWM_motor_1.ChangeDutyCycle(20)

                    if PositionCounterY < (PositionMaxY / 2):
                        headY = 1
                        GPIO.output(in3,GPIO.HIGH)
                        GPIO.output(in4,GPIO.LOW)
                        PWM_motor_2.ChangeDutyCycle(20)

                    elif PositionCounterY > (PositionMaxY / 2):
                        headY = -1
                        GPIO.output(in3,GPIO.LOW)
                        GPIO.output(in4,GPIO.HIGH)
                        PWM_motor_2.ChangeDutyCycle(20)

                    if PositionCounterX == (PositionMaxX / 2) and PositionCounterY == (PositionMaxY / 2):
                        GPIO.output(in1,GPIO.LOW)
                        GPIO.output(in2,GPIO.LOW)
                        GPIO.output(in3,GPIO.LOW)
                        GPIO.output(in4,GPIO.LOW)
                        headX = 0
                        headY = 0
                        center_head = 0



                else:
                    if headX != 0:
                        if headX < 0 and PositionCounterX > PositionMinX:
                            GPIO.output(in1,GPIO.LOW)
                            GPIO.output(in2,GPIO.HIGH)
                            if headX < -100:
                                headX = -100
                            PWM_motor_1.ChangeDutyCycle(round((headX * -1) / 5))

                        elif headX > 0 and PositionCounterX < PositionMaxX:
                            GPIO.output(in1,GPIO.HIGH)
                            GPIO.output(in2,GPIO.LOW)
                            if headX > 100:
                                headX = 100
                            PWM_motor_1.ChangeDutyCycle(round(headX / 5))
                        else:
                            GPIO.output(in1,GPIO.LOW)
                            GPIO.output(in2,GPIO.LOW)

                    elif headX == 0:
                        GPIO.output(in1,GPIO.LOW)
                        GPIO.output(in2,GPIO.LOW)


                    if headY != 0:
                        if headY < 0 and PositionCounterY > PositionMinY:
                            GPIO.output(in3,GPIO.LOW)
                            GPIO.output(in4,GPIO.HIGH)
                            if headY < -100:
                                headY = -100
                            PWM_motor_2.ChangeDutyCycle(round((headY * -1) / 5))
                        elif headY > 0 and PositionCounterY < PositionMaxY:
                            GPIO.output(in3,GPIO.HIGH)
                            GPIO.output(in4,GPIO.LOW)
                            if headY > 100:
                                headY = 100
                            PWM_motor_2.ChangeDutyCycle(round(headY / 5))
                        else:
                            GPIO.output(in3,GPIO.LOW)
                            GPIO.output(in4,GPIO.LOW)

                    elif headY == 0:
                        GPIO.output(in3,GPIO.LOW)
                        GPIO.output(in4,GPIO.LOW)

            elif emma_sleep == 1:
                print(f"{PositionCounterX} - {PositionCounterY}")
                if PositionCounterX < (PositionMaxX / 2):
                    headX = 1
                    GPIO.output(in1,GPIO.HIGH)
                    GPIO.output(in2,GPIO.LOW)
                    PWM_motor_1.ChangeDutyCycle(20)

                elif PositionCounterX > (PositionMaxX / 2):
                    headX = -1
                    GPIO.output(in1,GPIO.LOW)
                    GPIO.output(in2,GPIO.HIGH)
                    PWM_motor_1.ChangeDutyCycle(20)

                if PositionCounterY < (PositionMinY):
                    headY = -1
                    GPIO.output(in3,GPIO.HIGH)
                    GPIO.output(in4,GPIO.LOW)
                    PWM_motor_2.ChangeDutyCycle(20)

                if PositionCounterX == (PositionMaxX / 2) and PositionMinY == 0:
                    GPIO.output(in1,GPIO.LOW)
                    GPIO.output(in2,GPIO.LOW)
                    GPIO.output(in3,GPIO.LOW)
                    GPIO.output(in4,GPIO.LOW)
                    headX = 0
                    headY = 0
                    center_head = 0


            sleep(0.01)


    except IOError as e:
        pass
    except KeyboardInterrupt:
        GPIO.cleanup()
        exit()

def controlMovementEyes():
    try:
        while True:
            global eyesX
            global eyesY
            global emma_sleep

            if emma_sleep == 1:
                pass

            else:

                # print(f"eyes: {eyesX} {eyesY}")
                if eyesX <= -100:
                    Servo_PWM_1.ChangeDutyCycle(4)
                
                elif eyesX < -75:
                    Servo_PWM_1.ChangeDutyCycle(4.5)

                elif eyesX < -50:
                    Servo_PWM_1.ChangeDutyCycle(5)
                
                elif eyesX < -25:
                    Servo_PWM_1.ChangeDutyCycle(5.5)

                elif eyesX < 0:
                    Servo_PWM_1.ChangeDutyCycle(6)

                elif eyesX < 25:
                    Servo_PWM_1.ChangeDutyCycle(6.5)

                elif eyesX < 50:
                    Servo_PWM_1.ChangeDutyCycle(7)

                elif eyesX < 75:
                    Servo_PWM_1.ChangeDutyCycle(7.5)

                elif eyesX > 75:
                    Servo_PWM_1.ChangeDutyCycle(8)

                #  EYES Y

                if eyesY <= -100:
                    Servo_PWM_2.ChangeDutyCycle(4)
                
                elif eyesY < -75:
                    Servo_PWM_2.ChangeDutyCycle(4.5)

                elif eyesY < -50:
                    Servo_PWM_2.ChangeDutyCycle(5)
                
                elif eyesY < -25:
                    Servo_PWM_2.ChangeDutyCycle(5.5)

                elif eyesY < 0:
                    Servo_PWM_2.ChangeDutyCycle(6)

                elif eyesY < 25:
                    Servo_PWM_2.ChangeDutyCycle(6.5)

                elif eyesY < 50:
                    Servo_PWM_2.ChangeDutyCycle(7)

                elif eyesY < 75:
                    Servo_PWM_2.ChangeDutyCycle(7.5)

                elif eyesY > 75:
                    Servo_PWM_2.ChangeDutyCycle(8)


            sleep(0.2)
    except IOError as e:
        pass
    except KeyboardInterrupt:
        GPIO.cleanup()
        exit()

def controlMovementEyeLid():
    try:
        while True:
            global wink_left_status
            global wink_right_status
            global wink_both_status
            global emma_sleep

            sleep(0.01)

            if emma_sleep == 1:
                Servo_PWM_3.ChangeDutyCycle(9)
                Servo_PWM_4.ChangeDutyCycle(9)

            else:  
                # print(f"{wink_left_status} {wink_right_status} {wink_both_status}")
                if wink_left_status == 1:
                    Servo_PWM_3.ChangeDutyCycle(9)
                    sleep(0.8)
                    Servo_PWM_3.ChangeDutyCycle(2)

                elif wink_right_status == 1:
                    Servo_PWM_4.ChangeDutyCycle(9)
                    sleep(0.8)
                    Servo_PWM_4.ChangeDutyCycle(2)

                elif wink_both_status == 1:
                    Servo_PWM_3.ChangeDutyCycle(9)
                    Servo_PWM_4.ChangeDutyCycle(9)
                    sleep(0.8)
                    Servo_PWM_3.ChangeDutyCycle(2)
                    Servo_PWM_4.ChangeDutyCycle(2)

                wink_left_status = 0
                wink_right_status = 0
                wink_both_status = 0

    except IOError as e:
        pass
    except KeyboardInterrupt:
        GPIO.cleanup()
        exit()

# test reading
# thread0 = threading.Timer(1, testInput)
# thread0.start()

start()

thread1 = threading.Timer(1, controlMovementHead)
thread2 = threading.Timer(2, controlMovementEyes)
thread3 = threading.Timer(3, controlMovementEyeLid)
thread1.start()
thread2.start()
thread3.start()

print("**** Program started ****")

# API ENDPOINTS

@app.get("/function/{parameter}")
async def preset_function(parameter):
    global wink_left_status
    global wink_right_status
    global wink_both_status
    global center_head
    global emma_sleep

    print(f"Ontvangen parameter {parameter}")

    if parameter == "wink_left":
        wink_left_status = 1
        return {"Status": parameter}

    elif parameter == "wink_right":
        wink_right_status = 1
        return {"Status": parameter}

    elif parameter == "wink_both":
        wink_both_status = 1
        return {"Status": parameter}

    elif parameter == "head_center":
        center_head = 1
        return {"Status": parameter}

    elif parameter == "sleep":
        if emma_sleep == 0:
            emma_sleep = 1
        
        else:
            emma_sleep = 0
        return {"Status": parameter}

    else:
        return {"Status": "Invalid function"}

@app.get("/sleep/{status}")
async def preset_function(status):
    global emma_sleep
    global wink_both_status

    print(f"Ontvangen status slaapstand {status}")

    if status == "0":
        emma_sleep = 0
        
    elif status == "1":
        emma_sleep = 1
        wink_both_status = 1
        

    else:
        return {"Status": "Invalid sleepstatus"}


@app.get("/movement/head/{Xhead}/{Yhead}")
async def read_sensors(Xhead, Yhead):
    global headX
    global headY
    headX = float(Xhead)
    headY = float(Yhead)

    # printPositions()
    return {"Status": "ok", "Action": "Moving head and eyes"}

@app.get("/movement/eyes/{Xeyes}/{Yeyes}")
async def read_sensors(Xeyes, Yeyes):
    global eyesX
    global eyesY
    eyesX = float(Xeyes)
    eyesY = float(Yeyes)

    # printPositions()
    return {"Status": "ok", "Action": "Moving head and eyes"}

# @app.get("/function/{Xhead}/{Yhead}/{Xeyes}/{Yeyes}")
# async def read_sensors(Xhead, Yhead, Xeyes, Yeyes):
#     global headX
#     global headY
#     global eyesX
#     global eyesY
#     headX = Xhead
#     headY = Yhead
#     eyesX = Xeyes
#     eyesY = Yeyes

#     # printPositions()
#     return {"Status": "ok"}

@app.on_event("shutdown")
def shutdown_event():
    GPIO.cleanup()
    print("Bye bye")
