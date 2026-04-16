# a=12321
# b=a
# reverse =0

# for i in range(len(str(a))):
#     reverse = reverse*10 + a%10
#     a = a//10
# if (reverse == b):
#     print("It is Palindrome")
# else:
#     print("Not a Palindrome")
# print(reverse)
# print(a)

# l1 = [1,1,2,15,50,25,50]
# l2 = []
# for i in range(len(l1)):
#     if(l1[i] not in l2):
#         l2.append(l1[i])
# print(l2)
            
# class student():
#     def __init__(self,name):
#         self.name = name 
# s1 = student("Akshay")
# print(s1.name)


class Bus:
	def __init__(self,price,name):
		self.seat = [1,2,3,4,5,6,7,8,9,10]
		self.price = price
		self.name = name
		
	
	def getStatus(self):
		print(f"Bus name is {self.name}. Price is {self.price}. Number of available seats is {self.seat}")
	
	def bookTicket(self, seat_num):
		if (seat_num in self.seat):
			self.seat.remove(seat_num)
			print(f"Seat {seat_num} booked successfully.")
		else:
			print("Bus is fully booked.")
	def cancelTicket(self, seat_num):
		if(seat_num not in self.seat):
			self.seat.append(seat_num)
			print(f"Seat {seat_num} cancelled successfully.")
		else:
			print("Seat not booked previously")
		self.seat.sort()
bus = Bus(11, "Flixbus")
bus.getStatus()
bus.bookTicket(7)
bus.getStatus()
bus.cancelTicket(7)
bus.getStatus()


