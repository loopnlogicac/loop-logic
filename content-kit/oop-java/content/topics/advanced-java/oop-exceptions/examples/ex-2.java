class InvalidMarkException extends Exception {
    private static final long serialVersionUID = 1L;
    InvalidMarkException(String message) { super(message); }
}

class Main {
    static void accept(int mark) throws InvalidMarkException {
        if (mark < 0 || mark > 100) { throw new InvalidMarkException("Mark outside 0..100"); }
    }
    public static void main(String[] args) throws Exception {
        try {
            accept(101);
        } catch (InvalidMarkException problem) {
            System.out.println(problem.getMessage());
        }
    }
}
