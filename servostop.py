# Servo Control

def set(property, value):
	try:
		f = open("/sys/class/rpi-pwm/pwm0/" + property, 'w')
		f.write(value)
		f.close()
	except:
		print("Error writing to: " + property + " value: " + value)

def setServo(angle):
	set("servo", str(angle))

set("delayed", "0")
set("mode", "servo")
set("servo_max", "180")
set("active", "1")

setServo(45)

