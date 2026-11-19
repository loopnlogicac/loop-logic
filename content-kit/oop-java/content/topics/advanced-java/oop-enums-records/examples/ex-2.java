enum Status { AVAILABLE, BORROWED }

class Main {
    public static void main(String[] args) throws Exception {
        Status status = Status.BORROWED;
        String action = switch (status) {
            case AVAILABLE -> "Borrow";
            case BORROWED -> "Return";
        };
        System.out.println(action);
    }
}
