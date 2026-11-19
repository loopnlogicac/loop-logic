import javax.swing.SwingUtilities;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JButton;
import javax.swing.JTextField;
import javax.swing.JLabel;
import java.awt.FlowLayout;
import java.awt.BorderLayout;
import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;

class Calculator {
    int add(int left, int right) {
        if (Math.abs((long) left) > 1000 || Math.abs((long) right) > 1000) {
            throw new IllegalArgumentException("Use -1000..1000");
        }
        return left + right;
    }
}
class AddListener implements ActionListener {
    private final JTextField left;
    private final JTextField right;
    private final JLabel result;
    private final Calculator model;
    AddListener(JTextField left, JTextField right, JLabel result, Calculator model) {
        this.left = left; this.right = right; this.result = result; this.model = model;
    }
    @Override
    public void actionPerformed(ActionEvent event) {
        try {
            int a = Integer.parseInt(left.getText().strip());
            int b = Integer.parseInt(right.getText().strip());
            result.setText(Integer.toString(model.add(a, b)));
        } catch (NumberFormatException problem) {
            result.setText("Enter whole numbers");
        } catch (IllegalArgumentException problem) {
            result.setText(problem.getMessage());
        }
    }
}

class Main {
    public static void main(String[] args) throws Exception {
        SwingUtilities.invokeLater(() -> {
            Calculator model = new Calculator();
            JFrame frame = new JFrame("Add calculator");
            JPanel panel = new JPanel(new FlowLayout());
            JTextField left = new JTextField(6);
            JTextField right = new JTextField(6);
            JLabel result = new JLabel("Enter two integers");
            JButton add = new JButton("Add");
            add.addActionListener(new AddListener(left, right, result, model));
            panel.add(left);
            panel.add(right);
            panel.add(add);
            frame.add(result, BorderLayout.PAGE_END);
            frame.add(panel);
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.pack();
            frame.setLocationRelativeTo(null);
            frame.setVisible(true);
        });
    }
}
