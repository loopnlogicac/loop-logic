class Main {
    public static void main(String[] args) throws Exception {
        int rate = 3;
        class Fee {
            int total(int days) { return days * rate; }
        }
        System.out.println(new Fee().total(4));
    }
}
