class Slip {
    String text() { return "Paid"; }
}
class DetailedSlip extends Slip {
    @Override
    public String text() { return super.text() + " 500 BDT"; }
}

class Main {
    public static void main(String[] args) {
        System.out.println(new DetailedSlip().text());
    }
}
