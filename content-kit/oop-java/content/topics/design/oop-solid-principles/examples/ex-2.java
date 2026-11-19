class BranchFare {
    int amount(boolean student, int distance) { return distance * (student ? 2 : 4); }
}
interface Fare { int amount(int distance); }
class StudentFare implements Fare {
    @Override
    public int amount(int distance) { return distance * 2; }
}

class Main {
    public static void main(String[] args) {
        BranchFare oldFare = new BranchFare();
        System.out.println(oldFare.amount(true, 10));
        Fare fare = new StudentFare();
        System.out.println(fare.amount(10));
    }
}
