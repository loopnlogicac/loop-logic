class Vehicle {
    int wheels() { return 0; }
}
class Bus extends Vehicle {
    @Override
    int wheels() { return 6; }
}
class Bike extends Vehicle {
    @Override
    int wheels() { return 2; }
}

class Main {
    public static void main(String[] args) {
        System.out.println(new Bus().wheels());
        System.out.println(new Bike().wheels());
    }
}
