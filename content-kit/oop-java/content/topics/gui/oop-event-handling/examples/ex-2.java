import javax.swing.SwingUtilities;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JLabel;
import javax.swing.JButton;
import javax.swing.JTextField;

final class Calculator {
    int add(int left, int right) { return Math.addExact(left, right); }
    int divide(int left, int right) {
        if (right == 0) { throw new ArithmeticException("Zero divisor"); }
        if (left == Integer.MIN_VALUE && right == -1) {
            throw new ArithmeticException("Overflow");
        }
        return left / right;
    }
}

class Main {
    static void show() {
        JFrame frame = new JFrame("Integer calculator");
        JPanel panel = new JPanel();
        JTextField left = new JTextField(6);
        JTextField right = new JTextField(6);
        JLabel result = new JLabel("Ready");
        Calculator model = new Calculator();
        for (String operation : new String[] {"Add", "Divide"}) {
            JButton button = new JButton(operation);
            button.addActionListener(event -> {
                try {
                    int a = Integer.parseInt(left.getText().trim());
                    int b = Integer.parseInt(right.getText().trim());
                    int answer = operation.equals("Add") ? model.add(a, b) : model.divide(a, b);
                    result.setText(Integer.toString(answer));
                } catch (NumberFormatException failure) {
                    result.setText("Enter whole numbers");
                } catch (ArithmeticException failure) {
                    result.setText("Cannot calculate");
                }
            });
            panel.add(button);
        }
        panel.add(left);
        panel.add(right);
        panel.add(result);
        frame.setContentPane(panel);

        frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        frame.pack();
        frame.setLocationByPlatform(true);
        frame.setVisible(true);
    }
    public static void main(String[] args) throws Exception {
        SwingUtilities.invokeLater(Main::show);
    }
}
